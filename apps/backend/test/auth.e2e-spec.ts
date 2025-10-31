
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp, clearDatabase, getKnex } from './test-utils';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let knex: Knex;

  beforeAll(async () => {
    app = await createTestApp();
    knex = getKnex(app);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await clearDatabase(knex);
  });

  describe('/auth/login (POST)', () => {
    it('should login a user and return tokens', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const [tenant] = await knex('tenants').insert({ name: 'Test Tenant' }).returning('*');
      await knex('users').insert({
        email: 'test@example.com',
        password: hashedPassword,
        tenant_id: tenant.id,
        first_name: 'Test',
        last_name: 'User',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .set('x-tenant-id', tenant.id.toString())
        .send({ email: 'test@example.com', password })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should refresh the tokens', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const [tenant] = await knex('tenants').insert({ name: 'Test Tenant' }).returning('*');
      const [user] = await knex('users').insert({
        email: 'test@example.com',
        password: hashedPassword,
        tenant_id: tenant.id,
        first_name: 'Test',
        last_name: 'User',
      }).returning('*');

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .set('x-tenant-id', tenant.id.toString())
        .send({ email: 'test@example.com', password });

      const refreshToken = loginResponse.body.refreshToken;

      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(201);

      expect(refreshResponse.body).toHaveProperty('accessToken');
      expect(refreshResponse.body).toHaveProperty('refreshToken');
      expect(refreshResponse.body.refreshToken).not.toEqual(refreshToken);
    });

    it('should detect refresh token reuse', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const [tenant] = await knex('tenants').insert({ name: 'Test Tenant' }).returning('*');
      const [user] = await knex('users').insert({
        email: 'test@example.com',
        password: hashedPassword,
        tenant_id: tenant.id,
        first_name: 'Test',
        last_name: 'User',
      }).returning('*');

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .set('x-tenant-id', tenant.id.toString())
        .send({ email: 'test@example.com', password });

      const refreshToken = loginResponse.body.refreshToken;

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken });

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(403);
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should logout the user', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const [tenant] = await knex('tenants').insert({ name: 'Test Tenant' }).returning('*');
      const [user] = await knex('users').insert({
        email: 'test@example.com',
        password: hashedPassword,
        tenant_id: tenant.id,
        first_name: 'Test',
        last_name: 'User',
      }).returning('*');

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .set('x-tenant-id', tenant.id.toString())
        .send({ email: 'test@example.com', password });

      const accessToken = loginResponse.body.accessToken;

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      const refreshToken = await knex('refresh_tokens').where({ user_id: user.id }).first();
      expect(refreshToken.is_revoked).toBe(true);
    });
  });

  describe('Protected Route', () => {
    it('should not allow access to a protected route without a token', async () => {
      await request(app.getHttpServer())
        .patch('/auth/password')
        .send({ oldPassword: 'password', newPassword: 'newpassword' })
        .expect(401);
    });

    it('should allow access to a protected route with a valid token', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const [tenant] = await knex('tenants').insert({ name: 'Test Tenant' }).returning('*');
      await knex('users').insert({
        email: 'test@example.com',
        password: hashedPassword,
        tenant_id: tenant.id,
        first_name: 'Test',
        last_name: 'User',
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .set('x-tenant-id', tenant.id.toString())
        .send({ email: 'test@example.com', password });

      const accessToken = loginResponse.body.accessToken;
      const newPassword = 'newpassword';

      await request(app.getHttpServer())
        .patch('/auth/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ oldPassword: password, newPassword })
        .expect(200);

      const loginResponse2 = await request(app.getHttpServer())
        .post('/auth/login')
        .set('x-tenant-id', tenant.id.toString())
        .send({ email: 'test@example.com', password: newPassword });
      
      expect(loginResponse2.status).toBe(201);
    });
  });
});
