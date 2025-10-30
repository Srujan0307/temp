
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ContextService } from '../context/context.service';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly contextService: ContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.contextService.correlationId = req.headers['x-correlation-id'] as string || uuidv4();
    this.contextService.tenantId = req.headers['x-tenant-id'] as string;
    this.contextService.userId = req.headers['x-user-id'] as string;

    next();
  }
}
