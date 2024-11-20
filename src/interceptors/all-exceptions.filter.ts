import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errors =
      exception instanceof HttpException &&
      exception.getResponse() instanceof Object
        ? (exception.getResponse() as any).errors || { error: [message] }
        : { error: [message] };

    const errorResponse: ApiResponse<null> = {
      status: false,
      data: null,
      message,
      errors,
    };

    response.status(status).json(errorResponse);
  }
}
