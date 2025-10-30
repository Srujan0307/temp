
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { ContextService } from '../src/common/context/context.service';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ArgumentsHost } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let contextService: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: ContextService,
          useValue: {
            correlationId: 'test-correlation-id',
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
    contextService = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should catch HttpException and return formatted response', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    const host = createMock<ArgumentsHost>();
    const response = createMock<Response>();
    const request = createMock<Request>();

    const httpArgsHost = createMock<HttpArgumentsHost>();
    httpArgsHost.getResponse.mockReturnValue(response);
    httpArgsHost.getRequest.mockReturnValue(request);

    host.switchToHttp.mockReturnValue(httpArgsHost);

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Test error',
        traceId: 'test-correlation-id',
      }),
    );
  });

  it('should catch non-HttpException and return formatted response', () => {
    const exception = new Error('Test error');
    const host = createMock<ArgumentsHost>();
    const response = createMock<Response>();
    const request = createMock<Request>();

    const httpArgsHost = createMock<HttpArgumentsHost>();
    httpArgsHost.getResponse.mockReturnValue(response);
    httpArgsHost.getRequest.mockReturnValue(request);

    host.switchToHttp.mockReturnValue(httpArgsHost);

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: { message: 'Test error' },
        traceId: 'test-correlation-id',
      }),
    );
  });
});
