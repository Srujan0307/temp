import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, clearDatabase, getKnex, createTenant, createUser } from './test-utils';
import { Knex } from 'knex';

describe('FilingsController (e2e)', () => {
  let app: INestApplication;
  let knex: Knex;
  let accessToken: string;
  let tenant: any;

  beforeAll(async () => {
    app = await createTestApp();
    knex = getKnex(app);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clearDatabase(knex);
    tenant = await createTenant(knex);
    const user = await createUser(knex, tenant.id, { email: 'test@example.com' });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .set('x-tenant-id', tenant.id.toString())
      .send({ email: user.email, password: user.password });

    accessToken = loginResponse.body.accessToken;
  });

  describe('/filings (POST)', () => {
    it('should create a new filing', async () => {
      const filingData = { name: 'Test Filing', year: 2023 };

      const response = await request(app.getHttpServer())
        .post('/filings')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-tenant-id', tenant.id.toString())
        .send(filingData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(filingData.name);
      expect(response.body.year).toBe(filingData.year);
    });
  });

  describe('/filings (GET)', () => {
    it('should return a list of filings', async () => {
      await knex('filings').insert({ name: 'Test Filing', year: 2023, tenant_id: tenant.id });

      const response = await request(app.getHttpServer())
        .get('/filings')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-tenant-id', tenant.id.toString())
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Filing');
    });
  });

  describe('/filings/:id (GET)', () => {
    it('should return a single filing', async () => {
      const [filing] = await knex('filings').insert({ name: 'Test Filing', year: 2023, tenant_id: tenant.id }).returning('*');

      const response = await request(app.getHttpServer())
        .get(`/filings/${filing.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-tenant-id', tenant.id.toString())
        .expect(200);

      expect(response.body.name).toBe('Test Filing');
    });
  });

  describe('/filings/:id (PATCH)', () => {
    it('should update a filing', async () => {
      const [filing] = await knex('filings').insert({ name: 'Test Filing', year: 2023, tenant_id: tenant.id }).returning('*');
      const updatedData = { name: 'Updated Filing' };

      const response = await request(app.getHttpServer())
        .patch(`/filings/${filing.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-tenant-id', tenant.id.toString())
        .send(updatedData)
        .expect(200);

      expect(response.body.name).toBe('Updated Filing');
    });
  });

  describe('/filings/:id (DELETE)', () => {
    it('should delete a filing', async () => {
      const [filing] = await knex('filings').insert({ name: 'Test Filing', year: 2023, tenant_id: tenant.id }).returning('*');

      await request(app.getHttpServer())
        .delete(`/filings/${filing.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-tenant-id', tenant.id.toString())
        .expect(204);

      const deletedFiling = await knex('filings').where({ id: filing.id }).first();
      expect(deletedFiling).toBeUndefined();
    });
  });
});
