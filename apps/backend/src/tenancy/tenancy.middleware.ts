import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenancy.service';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(private readonly tenancyService: TenantService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // This is a workaround to make the tenancy service available on the request
    // object. A better approach would be to use a request-scoped provider.
    (req as any).tenancyService = this.tenancyService;
    next();
  }
}
