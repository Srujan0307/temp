
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ContextService } from '../context/context.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly contextService: ContextService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const traceId = this.contextService.correlationId;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: (exception as Error).message };

    this.logger.error(
      `[${traceId}] ${request.method} ${request.url} ${status} - ${JSON.stringify(message)}`,
      (exception as Error).stack,
    );

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new new Date().toISOString(),
      path: request.url,
      traceId,
    });
  }
}
