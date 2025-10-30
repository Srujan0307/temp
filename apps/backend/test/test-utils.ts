
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Knex } from 'knex';
import { Model } from 'objection';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  return app;
}

export async function clearDatabase(knex: Knex) {
  await knex('refresh_tokens').del();
  await knex('users').del();
  await knex('tenants').del();
}

export function getKnex(app: INestApplication): Knex {
  return app.get<Knex>('KnexConnection');
}
