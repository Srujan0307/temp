import { Provider, Scope } from '@nestjs/common';
import { Knex, knex } from 'knex';
import { TenancyService } from 'apps/backend/tenancy/tenancy.service';
import config from 'apps/backend/knexfile';
import { REQUEST } from '@nestjs/core';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

const knexProvider: Provider = {
  provide: KNEX_CONNECTION,
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: (request) => {
    const tenancyService = request.tenancyService;
    const knexInstance = knex(config.development);

    knexInstance.on('query', (query) => {
      const tenant = tenancyService.getTenant();
      if (tenant) {
        query.sql = `SET app.tenant = '${tenant}'; ${query.sql}`;
      }
    });

    return knexInstance;
  },
};

export const databaseProvider = [knexProvider];
