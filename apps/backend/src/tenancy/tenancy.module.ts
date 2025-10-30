import { Module, Global } from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { TenantController } from './tenant.controller';
import { TenancyGuard } from './tenancy.guard';
import { TenancyMiddleware } from './tenancy.middleware';
import { DatabaseModule } from '../database/database.module';
import { LoggingModule } from '../common/logging/logging.module';

@Global()
@Module({
  imports: [DatabaseModule, LoggingModule],
  controllers: [TenantController],
  providers: [TenancyService, TenancyGuard, TenancyMiddleware],
  exports: [TenancyService, TenancyMiddleware],
})
export class TenancyModule {}
