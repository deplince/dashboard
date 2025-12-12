import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IErrorResponse } from './interfaces';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: T, host: ArgumentsHost): any {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json(this._response(status, request, exception));
  }

  private _response(status: number, request: Request, exception: unknown) {
    // todo: very dirty type check, review
    let errorName = 'Error';
    let errorMessage = 'Internal server error';

    if (exception instanceof Error) {
      errorName = exception.name;
      errorMessage = exception.message;
    } else if (typeof exception === 'object' && exception !== null) {
      const err = exception as IErrorResponse;
      errorName = err.name || errorName;
      errorMessage = err.message || errorMessage;
    }

    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request?.url,
      method: request?.method,
      params: request?.params,
      query: request?.query,
      exception: {
        name: errorName,
        message: errorMessage,
      },
    };
  }
}
