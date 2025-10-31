import { Test, TestingModule } from '@nestjs/testing';
import { FilingsService } from './filings.service';
import { SlaService } from './sla.service';
import { mock } from 'jest-mock-extended';
import { Knex } from 'knex';
import { FilingsGateway } from './filings.gateway';
import { Filing, FilingStage } from './filing.entity';

describe('FilingsService', () => {
  let service: FilingsService;
  let slaService: SlaService;
  let knex: Knex;
  let filingsGateway: FilingsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilingsService,
        {
          provide: SlaService,
          useValue: {
            updateSlaStatus: jest.fn((filing) => Promise.resolve(filing)),
          },
        },
        {
          provide: 'KnexConnection',
          useFactory: () => {
            const knexMock = mock<Knex>();
            knexMock.insert.mockReturnThis();
            knexMock.returning.mockReturnThis();
            knexMock.update.mockReturnThis();
            knexMock.where.mockReturnThis();
            knexMock.del.mockReturnThis();
            return knexMock;
          },
        },
        {
          provide: FilingsGateway,
          useValue: {
            server: {
              emit: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FilingsService>(FilingsService);
    slaService = module.get<SlaService>(SlaService);
    knex = module.get<Knex>('KnexConnection');
    filingsGateway = module.get<FilingsGateway>(FilingsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should emit a filing.created event', async () => {
      const filing: Partial<Filing> = { name: 'test', stage: FilingStage.DRAFT };
      (knex.returning as jest.Mock).mockResolvedValue([filing]);
      await service.create(filing);
      expect(filingsGateway.server.emit).toHaveBeenCalledWith(
        'filing.created',
        filing,
      );
    });
  });

  describe('update', () => {
    it('should emit a filing.updated event', async () => {
      const filing: Partial<Filing> = { name: 'test', stage: FilingStage.DRAFT };
      (knex.returning as jest.Mock).mockResolvedValue([filing]);
      await service.update(1, filing);
      expect(filingsGateway.server.emit).toHaveBeenCalledWith(
        'filing.updated',
        filing,
      );
    });
  });

  describe('remove', () => {
    it('should emit a filing.removed event', async () => {
      await service.remove(1);
      expect(filingsGateway.server.emit).toHaveBeenCalledWith(
        'filing.removed',
        { id: 1 },
      );
    });
  });
});
