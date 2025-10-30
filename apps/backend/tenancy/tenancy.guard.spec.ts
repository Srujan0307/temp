import { Test, TestingModule } from '@nestjs/testing';
import { TenancyGuard } from './tenancy.guard';
import { TenancyService } from './tenancy.service';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

describe('TenancyGuard', () => {
  let guard: TenancyGuard;
  let service: TenancyService;

  const mockRequest = {
    headers: {
      host: 'tenant1.example.com',
    },
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenancyGuard,
        {
          provide: TenancyService,
          useValue: {
            resolveTenantFromRequest: jest.fn(),
            setTenant: jest.fn(),
          },
        },
      ],
    })
    .overrideProvider(REQUEST)
    .useValue(mockRequest)
    .compile();

    guard = module.get<TenancyGuard>(TenancyGuard);
    service = module.get<TenancyService>(TenancyService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when tenant is resolved', () => {
    const context = createMock<ExecutionContext>();
    jest.spyOn(service, 'resolveTenantFromRequest').mockReturnValue('tenant1');

    expect(guard.canActivate(context)).toBe(true);
    expect(service.setTenant).toHaveBeenCalledWith('tenant1');
  });

  it('should deny access when tenant is not resolved', () => {
    const context = createMock<ExecutionContext>();
    jest.spyOn(service, 'resolveTenantFromRequest').mockReturnValue(null);

    expect(guard.canActivate(context)).toBe(false);
    expect(service.setTenant).not.toHaveBeenCalled();
  });
});
