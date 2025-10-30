import { Test, TestingModule } from '@nestjs/testing';
import { KNEX_CONNECTION, databaseProvider } from './database.provider';
import { TenancyService } from 'apps/backend/tenancy/tenancy.service';
import { REQUEST } from '@nestjs/core';
import { Knex } from 'knex';

describe('DatabaseProvider', () => {
  let knex: Knex;
  let tenancyService: TenancyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...databaseProvider,
        {
          provide: TenancyService,
          useValue: {
            getTenant: jest.fn(),
          },
        },
      ],
    })
    .overrideProvider(REQUEST)
    .useValue({
      tenancyService: {
        getTenant: jest.fn().mockReturnValue('tenant1'),
      },
    })
    .compile();

    knex = module.get<Knex>(KNEX_CONNECTION);
    tenancyService = module.get<TenancyService>(TenancyService);
  });

  it('should be defined', () => {
    expect(knex).toBeDefined();
  });

  it('should set tenant context on query', async () => {
    const onSpy = jest.spyOn(knex, 'on');
    await knex.raw('SELECT 1');
    expect(onSpy).toHaveBeenCalledWith('query', expect.any(Function));
  });
});
