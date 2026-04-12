import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

/**
 * Logs request/response details for debugging and monitoring
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    const now = Date.now();

    // Log request
    this.logger.log(
      `[${method}] ${url} - ${ip} - ${userAgent.substring(0, 50)}`,
    );

    // Log request body in development
    if (process.env.NODE_ENV !== 'production' && body && Object.keys(body).length > 0) {
      this.logger.debug(`Request body: ${JSON.stringify(this.sanitizeBody(body))}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `[${method}] ${url} - ${responseTime}ms`,
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `[${method}] ${url} - ${responseTime}ms - ${error.message}`,
          );
        },
      }),
    );
  }

  /**
   * Remove sensitive fields from logs
   */
  private sanitizeBody(body: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'accessToken', 'refreshToken'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
