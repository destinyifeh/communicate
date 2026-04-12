import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * Transforms all successful responses to a consistent format
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}

/**
 * Alternative interceptor that only wraps non-object responses
 * Useful when some endpoints return their own structured responses
 */
@Injectable()
export class ConditionalTransformInterceptor<T>
  implements NestInterceptor<T, T | SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<T | SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the response already has a 'success' property, return as-is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // If it's a paginated response, return as-is
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          return data;
        }

        // Otherwise wrap it
        return {
          success: true as const,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
