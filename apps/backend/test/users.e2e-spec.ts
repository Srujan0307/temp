import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Knex } from 'knex';
import { User } from '../src/users/user.entity';
import { sign } from 'jsonwebtoken';
import { ConfigModule } from '@nestjs/config';

describe('Users', () => {
  let app: INestApplication;
  let knex: Knex;
  let adminUser: User;
  let normalUser: User;
  let adminToken: string;
  let normalUserToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    knex = app.get('KnexConnection');
    await app.init();

    // Create a tenant
    const [tenant] = await knex('tenants').insert({ name: 'test-tenant' }).returning('*');

    // Create users
    [adminUser] = await knex('users').insert({ email: 'admin@test.com', password: 'password', tenant_id: tenant.id, firstName: 'Admin', lastName: 'User' }).returning('*');
    [normalUser] = await knex('users').insert({ email: 'user@test.com', password: 'password', tenant_id: tenant.id, firstName: 'Normal', lastName: 'User' }).returning('*');

    // Assign roles
    await knex('user_roles').insert({ user_id: adminUser.id, role: 'admin' });

    // Generate tokens
    adminToken = sign({ id: adminUser.id, email: adminUser.email, tenantId: tenant.id }, process.env.JWT_SECRET!);
    normalUserToken = sign({ id: normalUser.id, email: normalUser.email, tenantId: tenant.id }, process.env.JWT_SECRET!);
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });
  
  describe('GET /users', () => {
    it('should return 401 Unauthorized when no token is provided', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });

    it('should return 403 Forbidden when the user is not an admin', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .expect(403);
    });

    it('should return 200 OK when the user is an admin', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  describe('POST /users/invite', () => {
    it('should return 401 Unauthorized when no token is provided', () => {
      return request(app.getHttpServer())
        .post('/users/invite')
        .send({ email: 'test@test.com', role: 'member' })
        .expect(401);
    });

    it('should return 403 Forbidden when the user is not an admin', () => {
      return request(app.getHttpServer())
        .post('/users/invite')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({ email: 'test@test.com', role: 'member' })
        .expect(403);
    });

    it('should return 201 Created when the user is an admin', () => {
      return request(app.getHttpServer())
        .post('/users/invite')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ email: 'test@test.com', role: 'member' })
        .expect(201);
    });
  });
});
