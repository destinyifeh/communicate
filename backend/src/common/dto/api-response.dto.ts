import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiPropertyOptional()
  data?: T;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  error?: {
    code?: string;
    message: string;
    details?: Record<string, string[]>;
  };

  static success<T>(data: T, message?: string): ApiResponseDto<T> {
    const response = new ApiResponseDto<T>();
    response.success = true;
    response.data = data;
    if (message) response.message = message;
    return response;
  }

  static error(message: string, code?: string, details?: Record<string, string[]>): ApiResponseDto<null> {
    const response = new ApiResponseDto<null>();
    response.success = false;
    response.error = { message, code, details };
    return response;
  }
}

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiPropertyOptional()
  message?: string;

  static create(message?: string): SuccessResponseDto {
    return { success: true, message };
  }
}
