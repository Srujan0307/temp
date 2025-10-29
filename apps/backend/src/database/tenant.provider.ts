import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Knex, knex } from 'knex';
import { TENANT_CONNECTION } from './constants';
import { Request } from 'express';

export const tenantProvider: Provider = {
  provide: TENANT_CONNECTION,
  scope: Scope.REQUEST,
  useFactory: (req: Request) => {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new Error('X-Tenant-ID header is missing');
    }

    // This is where you would fetch the tenant's database configuration
    // from a central database or a configuration service.
    // For this example, we'll use a simplified, hardcoded approach.
    const dbName = `tenant_${tenantId}`;

    const knexConfig: Knex.Config = {
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: dbName,
      },
    };

    return knex(knexConfig);
  },
  inject: [REQUEST],
};
