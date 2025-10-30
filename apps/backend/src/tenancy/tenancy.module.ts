import { Module, Global } from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { TenancyGuard } from './tenancy.guard';
import { TenancyMiddleware } from './tenancy.middleware';

@Global()
@Module({
  providers: [TenancyService, TenancyGuard, TenancyMiddleware],
  exports: [TenancyService, TenancyMiddleware],
})
export class TenancyModule {}
