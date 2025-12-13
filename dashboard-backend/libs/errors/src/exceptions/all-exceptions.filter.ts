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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // naive implementation of error checking - logging systme errors only
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }
    response.status(status).json(this._response(status, request, exception));
  }

  private _response(status: number, request: Request, exception: unknown) {
    let errorName = 'Error';
    let errorMessage: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      errorName = exception.name;
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null && 'message' in res) {
        errorMessage = (res as { message: string | string[] }).message; // linter is too strict
      } else {
        errorMessage = exception.message;
      }
    } else if (exception instanceof Error) {
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
