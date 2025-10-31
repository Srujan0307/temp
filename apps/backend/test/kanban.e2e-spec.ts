import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Knex } from 'knex';
import { sign } from 'jsonwebtoken';
import { FilingStage } from '../src/filings/filing.entity';

describe('Kanban Controller', () => {
  let app: INestApplication;
  let knex: Knex;
  let authToken: string;
  let tenantId: string;
  let filingId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    knex = app.get('KnexConnection');
    await app.init();

    const [tenant] = await knex('tenants').insert({ name: 'test-tenant' }).returning('*');
    tenantId = tenant.id;
    const [user] = await knex('users').insert({ email: 'test@test.com', password: 'password', tenant_id: tenantId, first_name: 'Test', last_name: 'User' }).returning('*');
    const [client] = await knex('clients').insert({ name: 'test-client', tenant_id: tenantId }).returning('*');
    const [vehicle] = await knex('vehicles').insert({ name: 'test-vehicle', tenant_id: tenantId }).returning('*');
    const [filing] = await knex('filings').insert({
      type: 'Test Filing',
      tenant_id: tenantId,
      client_id: client.id,
      vehicle_id: vehicle.id,
      due_date: new Date(),
      stage: FilingStage.DRAFT,
      assigned_to: user.id,
    }).returning('*');
    filingId = filing.id;

    authToken = sign({ id: user.id, email: user.email, tenantId }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await knex.destroy();
    await app.close();
  });

  describe('GET /filings/kanban', () => {
    it('should return 401 Unauthorized when no token is provided', () => {
      return request(app.getHttpServer()).get('/filings/kanban').expect(401);
    });

    it('should return the kanban board structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/filings/kanban')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(Object.keys(FilingStage).length);
      response.body.forEach(column => {
        expect(column).toHaveProperty('stage');
        expect(column).toHaveProperty('cards');
        expect(column).toHaveProperty('count');
        expect(column).toHaveProperty('meta');
      });
    });

    it('should filter by clientId', async () => {
        const [otherClient] = await knex('clients').insert({ name: 'other-client', tenant_id: tenantId }).returning('*');
        const response = await request(app.getHttpServer())
          .get(`/filings/kanban?clientId=${otherClient.id}`)
          .set('Authorization', `Bearer ${authToken}`);
        
        expect(response.status).toBe(200);
        response.body.forEach(column => {
            expect(column.count).toBe(0);
        });
    });

    it('should not return data from other tenants', async () => {
        const [otherTenant] = await knex('tenants').insert({ name: 'other-tenant' }).returning('*');
        const [otherUser] = await knex('users').insert({ email: 'other@test.com', password: 'password', tenant_id: otherTenant.id, first_name: 'Other', last_name: 'User' }).returning('*');
        const otherToken = sign({ id: otherUser.id, email: otherUser.email, tenantId: otherTenant.id }, process.env.JWT_SECRET);

        const response = await request(app.getHttpServer())
        .get(`/filings/kanban`)
        .set('Authorization', `Bearer ${otherToken}`);
      
        expect(response.status).toBe(200);
        response.body.forEach(column => {
            expect(column.count).toBe(0);
        });
    });
  });

  describe('PATCH /filings/:id/stage', () => {
    it('should return 401 Unauthorized when no token is provided', () => {
      return request(app.getHttpServer())
        .patch(`/filings/${filingId}/stage`)
        .send({ stage: FilingStage.IN_REVIEW })
        .expect(401);
    });

    it('should update the filing stage', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/filings/${filingId}/stage`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ stage: FilingStage.IN_REVIEW });

      expect(response.status).toBe(200);
      expect(response.body.stage).toBe(FilingStage.IN_REVIEW);
    });

    it('should not update if transition is not allowed', async () => {
        await request(app.getHttpServer())
        .patch(`/filings/${filingId}/stage`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ stage: FilingStage.DRAFT });

        const response = await request(app.getHttpServer())
          .patch(`/filings/${filingId}/stage`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ stage: FilingStage.SUBMITTED });
  
        expect(response.status).toBe(400);
      });

      it('should not update filing from another tenant', async () => {
        const [otherTenant] = await knex('tenants').insert({ name: 'other-tenant-2' }).returning('*');
        const [otherUser] = await knex('users').insert({ email: 'other2@test.com', password: 'password', tenant_id: otherTenant.id, first_name: 'Other', last_name: 'User' }).returning('*');
        const otherToken = sign({ id: otherUser.id, email: otherUser.email, tenantId: otherTenant.id }, process.env.JWT_SECRET);

        const response = await request(app.getHttpServer())
          .patch(`/filings/${filingId}/stage`)
          .set('Authorization', `Bearer ${otherToken}`)
          .send({ stage: FilingStage.IN_REVIEW });
  
        expect(response.status).toBe(404);
      });
  });
});
