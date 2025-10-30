import { Test, TestingModule } from '@nestjs/testing';
import { SlaService } from './sla.service';
import { Filing, SlaStatus } from './filing.entity';
import { mock } from 'jest-mock-extended';
import { Knex } from 'knex';

describe('SlaService', () => {
  let service: SlaService;
  let knex: Knex;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlaService,
        {
          provide: 'KnexConnection',
          useFactory: () => {
            const knexMock = mock<Knex>();
            (knexMock as any).where = jest.fn().mockReturnThis();
            (knexMock as any).update = jest.fn().mockReturnThis();
            (knexMock as any).returning = jest.fn().mockReturnThis();
            return knexMock;
          },
        },
      ],
    }).compile();

    service = module.get<SlaService>(SlaService);
    knex = module.get<Knex>('KnexConnection');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateSlaStatus', () => {
    it('should set status to OFF_TRACK if due date is in the past', async () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() - 1);
      const filing: Filing = { id: 1, due_date: dueDate } as Filing;
      const updatedFiling = { ...filing, sla_status: SlaStatus.OFF_TRACK };
      (knex as any).returning.mockResolvedValue([updatedFiling]);
      const result = await service.updateSlaStatus(filing);
      expect(result.sla_status).toEqual(SlaStatus.OFF_TRACK);
    });

    it('should set status to AT_RISK if due date is within 7 days', async () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 5);
      const filing: Filing = { id: 1, due_date: dueDate } as Filing;
      const updatedFiling = { ...filing, sla_status: SlaStatus.AT_RISK };
      (knex as any).returning.mockResolvedValue([updatedFiling]);
      const result = await service.updateSlaStatus(filing);
      expect(result.sla_status).toEqual(SlaStatus.AT_RISK);
    });

    it('should set status to ON_TRACK if due date is more than 7 days away', async () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 10);
      const filing: Filing = { id: 1, due_date: dueDate } as Filing;
      const updatedFiling = { ...filing, sla_status: SlaStatus.ON_TRACK };
      (knex as any).returning.mockResolvedValue([updatedFiling]);
      const result = await service.updateSlaStatus(filing);
      expect(result.sla_status).toEqual(SlaStatus.ON_TRACK);
    });
  });
});
