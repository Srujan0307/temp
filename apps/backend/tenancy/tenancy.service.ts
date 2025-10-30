import { Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TenancyService {
  private tenant: string;

  setTenant(tenant: string) {
    this.tenant = tenant;
  }

  getTenant(): string {
    return this.tenant;
  }

  resolveTenantFromRequest(request: Request): string {
    const host = request.headers.host;
    const parts = host.split('.');
    if (parts.length > 2) {
      return parts[0];
    }
    return null;
  }
}
