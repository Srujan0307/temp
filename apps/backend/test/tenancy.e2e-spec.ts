
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Tenancy', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`/POST tenants`, () => {
    return request(app.getHttpServer())
      .post('/tenants')
      .send({ name: 'Test Tenant', domain: 'test.localhost' })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
