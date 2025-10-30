import { Test, TestingModule } from '@nestjs/testing';
import { FilingStageService } from './filing-stage.service';
import { Knex } from 'knex';
import { mock } from 'jest-mock-extended';
import { Filing, FilingStage } from './filing.entity';
import { BadRequestException } from '@nestjs/common';

describe('FilingStageService', () => {
  let service: FilingStageService;
  let knex: Knex;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilingStageService,
        {
          provide: 'KnexConnection',
          useFactory: () => {
            const knexMock = mock<Knex>();
            const queryBuilder = mock<Knex.QueryBuilder>();
            const transaction = mock<Knex.Transaction>();

            knexMock.transaction.mockImplementation(async (callback) => {
              return callback(transaction);
            });

            (knexMock as any).where = jest.fn().mockReturnThis();
            (knexMock as any).first = jest.fn().mockReturnThis();
            (knexMock as any).update = jest.fn().mockReturnThis();
            (knexMock as any).returning = jest.fn().mockReturnThis();

            return knexMock;
          },
        },
      ],
    }).compile();

    service = module.get<FilingStageService>(FilingStageService);
    knex = module.get<Knex>('KnexConnection');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transition', () => {
    it('should throw an error if the filing is not found', async () => {
      (knex as any).first.mockResolvedValue(null);
      await expect(service.transition(1, FilingStage.IN_REVIEW)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error for an invalid transition', async () => {
      const filing: Filing = {
        id: 1,
        stage: FilingStage.DRAFT,
      } as Filing;
      (knex as any).first.mockResolvedValue(filing);
      await expect(service.transition(1, FilingStage.APPROVED)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should transition the stage of a filing', async () => {
      const filing: Filing = {
        id: 1,
        stage: FilingStage.DRAFT,
      } as Filing;
      const updatedFiling = { ...filing, stage: FilingStage.IN_REVIEW };
      (knex as any).first.mockResolvedValue(filing);
      (knex as any).returning.mockResolvedValue([updatedFiling]);
      const result = await service.transition(1, FilingStage.IN_REVIEW);
      expect(result.stage).toEqual(FilingStage.IN_REVIEW);
    });
  });
});
