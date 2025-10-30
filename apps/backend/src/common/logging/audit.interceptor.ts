
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { AUDIT_KEY } from './audit.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const auditMessage = this.reflector.get<string>(
      AUDIT_KEY,
      context.getHandler(),
    );

    if (!auditMessage) {
      return next.handle();
    }

    return next
      .handle()
      .pipe(
        tap(() => {
          this.auditService.log(auditMessage);
        }),
      );
  }
}
