import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload) => {
        if (payload && typeof payload === 'object' && 'success' in payload) {
          return payload;
        }
        if (
          payload &&
          typeof payload === 'object' &&
          'data' in payload &&
          'meta' in payload
        ) {
          return { success: true, ...payload };
        }
        return { success: true, data: payload };
      }),
    );
  }
}
