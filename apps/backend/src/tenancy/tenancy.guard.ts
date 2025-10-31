import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { TenantService } from './tenancy.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class TenancyGuard implements CanActivate {
  constructor(
    private readonly tenancyService: TenantService,
    @Inject(REQUEST) private request: Request,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const tenant = this.tenancyService.resolveTenantFromRequest(this.request);
    if (!tenant) {
      return false;
    }
    this.tenancyService.setTenant(tenant);
    return true;
  }
}
