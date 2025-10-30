
import { Test, TestingModule } from '@nestjs/testing';
import { ContextService } from '../src/common/context/context.service';

describe('ContextService', () => {
  let service: ContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContextService],
    }).compile();

    service = module.get<ContextService>(ContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set and get tenantId', () => {
    const tenantId = 'test-tenant';
    service.tenantId = tenantId;
    expect(service.tenantId).toEqual(tenantId);
  });

  it('should set and get userId', () => {
    const userId = 'test-user';
    service.userId = userId;
    expect(service.userId).toEqual(userId);
  });

  it('should set and get correlationId', () => {
    const correlationId = 'test-correlation-id';
    service.correlationId = correlationId;
    expect(service.correlationId).toEqual(correlationId);
  });
});
