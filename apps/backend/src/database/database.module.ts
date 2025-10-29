import { Module, Global } from '@nestjs/common';
import { tenantProvider } from './tenant.provider';
import { TENANT_CONNECTION } from './constants';

@Global()
@Module({
  providers: [tenantProvider],
  exports: [TENANT_CONNECTION],
})
export class DatabaseModule {}
