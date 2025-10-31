
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TenantService } from './tenancy.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { AuthGuard } from '@nestjs/passport';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';
import { Audit } from '../common/logging/audit.decorator';
import { AuditInterceptor } from '../common/logging/audit.interceptor';

@Controller('tenants')
@UseGuards(AuthGuard('jwt'), SuperAdminGuard)
@UseInterceptors(AuditInterceptor)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @Audit('Tenant created')
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.create(createTenantDto);
  }

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(+id);
  }

  @Patch(':id')
  @Audit('Tenant updated')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantService.update(+id, updateTenantDto);
  }

  @Delete(':id')
  @Audit('Tenant deleted')
  remove(@Param('id') id: string) {
    return this.tenantService.remove(+id);
  }
}
