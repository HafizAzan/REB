import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = isHttp ? exception.getResponse() : null;

    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (typeof body === 'string') {
      message = body;
    } else if (body && typeof body === 'object') {
      const record = body as Record<string, unknown>;
      if (Array.isArray(record.message)) {
        message = record.message.join(', ');
        code = 'VALIDATION_ERROR';
      } else if (typeof record.message === 'string') {
        message = record.message;
      }
      if (typeof record.code === 'string') {
        code = record.code;
      } else if (status === HttpStatus.UNAUTHORIZED) {
        code = 'UNAUTHORIZED';
      } else if (status === HttpStatus.FORBIDDEN) {
        code = 'FORBIDDEN';
      } else if (status === HttpStatus.NOT_FOUND) {
        code = 'NOT_FOUND';
      } else if (status === HttpStatus.CONFLICT) {
        code = 'CONFLICT';
      }
    }

    if (!isHttp) {
      this.logger.error(exception);
    }

    response.status(status).json({
      success: false,
      message: process.env.NODE_ENV === 'production' && status >= 500 ? 'Internal server error' : message,
      code,
    });
  }
}
