import { Test, TestingModule } from '@nestjs/testing';
import { FilingStageService } from './filing-stage.service';
import { Knex } from 'knex';
import { mock } from 'jest-mock-extended';
import { Filing, FilingStage } from './filing.entity';
import { BadRequestException } from '@nestjs/common';
import { FilingsGateway } from './filings.gateway';

describe('FilingStageService', () => {
  let service: FilingStageService;
  let knex: Knex;
  let filingsGateway: FilingsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilingStageService,
        {
          provide: 'KnexConnection',
          useFactory: () => {
            const knexMock = mock<Knex>();
            knexMock.where = jest.fn().mockReturnThis();
            knexMock.first = jest.fn().mockReturnThis();
            knexMock.update = jest.fn().mockReturnThis();
            knexMock.returning = jest.fn().mockReturnThis();
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

    service = module.get<FilingStageService>(FilingStageService);
    knex = module.get<Knex>('KnexConnection');
    filingsGateway = module.get<FilingsGateway>(FilingsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transition', () => {
    it('should throw an error if the filing is not found', async () => {
      (knex.first as jest.Mock).mockResolvedValue(null);
      await expect(service.transition(1, FilingStage.IN_REVIEW)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error for an invalid transition', async () => {
      const filing: Filing = {
        id: 1,
        stage: FilingStage.DRAFT,
      } as Filing;
      (knex.first as jest.Mock).mockResolvedValue(filing);
      await expect(service.transition(1, FilingStage.APPROVED)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should transition the stage of a filing and emit an event', async () => {
      const filing: Filing = {
        id: 1,
        stage: FilingStage.DRAFT,
      } as Filing;
      const updatedFiling = { ...filing, stage: FilingStage.IN_REVIEW };
      (knex.first as jest.Mock).mockResolvedValue(filing);
      (knex.returning as jest.Mock).mockResolvedValue([updatedFiling]);
      const result = await service.transition(1, FilingStage.IN_REVIEW);
      expect(result.stage).toEqual(FilingStage.IN_REVIEW);
      expect(filingsGateway.server.emit).toHaveBeenCalledWith(
        'filing.moved',
        updatedFiling,
      );
    });
  });
});
