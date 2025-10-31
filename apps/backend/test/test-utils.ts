
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Knex } from 'knex';
import { Model } from 'objection';
import * as bcrypt from 'bcrypt';

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
  await knex('filings').del();
  await knex('users').del();
  await knex('tenants').del();
}

export function getKnex(app: INestApplication): Knex {
  return app.get<Knex>('KnexConnection');
}

export async function createTenant(knex: Knex, name = 'Test Tenant') {
  const [tenant] = await knex('tenants').insert({ name }).returning('*');
  return tenant;
}

export async function createUser(knex: Knex, tenantId: number, userData: any) {
  const password = userData.password || 'password';
  const hashedPassword = await bcrypt.hash(password, 10);
  const [user] = await knex('users').insert({
    email: userData.email || 'test@example.com',
    password: hashedPassword,
    tenant_id: tenantId,
    first_name: userData.firstName || 'Test',
    last_name: userData.lastName || 'User',
  }).returning('*');

  return { ...user, password };
}
