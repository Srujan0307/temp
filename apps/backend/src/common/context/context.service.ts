
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  private _tenantId: string;
  private _userId: string;
  private _correlationId: string;

  set tenantId(tenantId: string) {
    this._tenantId = tenantId;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  set userId(userId: string) {
    this._userId = userId;
  }

  get userId(): string {
    return this._userId;
  }

  set correlationId(correlationId: string) {
    this._correlationId = correlationId;
  }

  get correlationId(): string {
    return this._correlationId;
  }
}
