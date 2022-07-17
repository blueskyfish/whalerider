import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { DateTime } from 'luxon';
import { ErrorBody } from './error-body.entity';
import { ErrorItem } from './error-item';

export const ERROR_CTX = 'Exception'


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorItem: ErrorItem = exception.getResponse() as ErrorItem;
    const errorBody: ErrorBody = {
      code: errorItem.code,
      message: errorItem.message ?? exception.message,
      status: status,
      method: request.method,
      path: request.originalUrl,
      timestamp: DateTime.now().toSQL(),
    }

    response
      .send(errorBody)
      .status(status)
      .end(() => {
        Logger.error(`Http Exception (Status=${status})\n${JSON.stringify(errorItem, null, 2)}`, exception.stack, ERROR_CTX);
      });
  }
}
