import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    timestamp: string;
    path: string;
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';
    let details: Record<string, string[]> | undefined;

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, any>;
        message = resp.message || exception.message;
        code = resp.error || this.getCodeFromStatus(status);

        // Handle validation errors from class-validator
        if (Array.isArray(resp.message)) {
          message = 'Validation failed';
          details = this.formatValidationErrors(resp.message);
        }
      }
    }

    // Handle Prisma errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = this.handlePrismaError(exception);
      status = prismaError.status;
      code = prismaError.code;
      message = prismaError.message;
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      code = 'VALIDATION_ERROR';
      message = 'Invalid data provided';
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    response.status(status).json(errorResponse);
  }

  private getCodeFromStatus(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'UNPROCESSABLE_ENTITY';
      case 429:
        return 'TOO_MANY_REQUESTS';
      default:
        return 'INTERNAL_ERROR';
    }
  }

  private formatValidationErrors(errors: string[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    for (const error of errors) {
      // Try to extract field name from common validation patterns
      const match = error.match(/^(\w+)\s+(.+)$/);
      if (match) {
        const [, field, msg] = match;
        if (!formatted[field]) formatted[field] = [];
        formatted[field].push(msg);
      } else {
        if (!formatted['general']) formatted['general'] = [];
        formatted['general'].push(error);
      }
    }

    return formatted;
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
    status: number;
    code: string;
    message: string;
  } {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const target = error.meta?.target as string[];
        const field = target?.[0] || 'field';
        return {
          status: HttpStatus.CONFLICT,
          code: 'DUPLICATE_ENTRY',
          message: `A record with this ${field} already exists`,
        };

      case 'P2025':
        // Record not found
        return {
          status: HttpStatus.NOT_FOUND,
          code: 'NOT_FOUND',
          message: 'Record not found',
        };

      case 'P2003':
        // Foreign key constraint violation
        return {
          status: HttpStatus.BAD_REQUEST,
          code: 'INVALID_REFERENCE',
          message: 'Referenced record does not exist',
        };

      case 'P2014':
        // Required relation violation
        return {
          status: HttpStatus.BAD_REQUEST,
          code: 'REQUIRED_RELATION',
          message: 'Required related record not provided',
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          code: 'DATABASE_ERROR',
          message: 'A database error occurred',
        };
    }
  }
}
