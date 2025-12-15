import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    console.log('Exception caught:', exception);
    this.logger.error(`Exception caught: ${exception.name}`, exception.stack);
    const ctx = host.switchToHttp();
    ``;
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || HttpStatus[status];
      } else {
        message = exception.message;
        error = HttpStatus[status];
      }
    } else if (
      exception instanceof NotFoundException ||
      exception.status === HttpStatus.NOT_FOUND
    ) {
      status = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
      error = 'Not Found';
    } else if (exception.name === 'SequelizeUniqueConstraintError') {
      status = HttpStatus.CONFLICT;
      const field = Object.keys(exception.fields)[0];
      message = `A record with this ${field} already exists`;
      error = 'Conflict';
    } else if (exception.name === 'SequelizeValidationError') {
      status = HttpStatus.BAD_REQUEST;
      const validationErrors = exception.errors
        .map((err) => `${err.path}: ${err.message}`)
        .join(', ');
      message = `Validation error: ${validationErrors}`;
      error = 'Bad Request';
    } else if (exception.name === 'SequelizeDatabaseError') {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message || 'Database error occurred';
      error = 'Bad Request';
    }
    // Handle exceptions with explicit status
    else if (exception.status) {
      status = exception.status;
      message = exception.message || HttpStatus[status] || 'An error occurred';
      error = exception.error || HttpStatus[status];
    }

    this.logger.error(
      `${status} - ${error}: ${message}`,
      exception.stack,
      GlobalExceptionFilter.name,
    );

    response.status(status).json({
      statusCode: status,
      error: error,
      message: message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
