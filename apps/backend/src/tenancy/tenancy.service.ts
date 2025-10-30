
import { Injectable, Inject } from '@nestjs/common';
import { KNEX_CONNECTION } from '../database/database.provider';
import { Knex } from 'knex';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const { name, domain } = createTenantDto;
    const schemaName = name.toLowerCase().replace(/\s/g, '_');

    await this.knex.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    await this.knex.migrate.latest({ schemaName });
    await this.knex.seed.run({ directory: './seeds', schemaName });

    const tenant = await this.knex('tenants')
      .insert({ name, domain, schemaName })
      .returning('*');

    return tenant[0];
  }

  async findAll(): Promise<Tenant[]> {
    return this.knex('tenants').select('*');
  }

  async findOne(id: number): Promise<Tenant> {
    return this.knex('tenants').where({ id }).first();
  }

  async update(id: number, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const [tenant] = await this.knex('tenants')
      .where({ id })
      .update(updateTenantDto)
      .returning('*');
    return tenant;
  }

  async remove(id: number): Promise<void> {
    await this.knex('tenants').where({ id }).del();
  }
}

