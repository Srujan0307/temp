import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenancyService } from './tenancy.service';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(private readonly tenancyService: TenancyService) {}

  use(req: Request, res: Response, next: NextFunction) {
    req.tenancyService = this.tenancyService;
    next();
  }
}
