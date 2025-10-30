import { Test, TestingModule } from '@nestjs/testing';
import { FilingsService } from './filings.service';
import { SlaService } from './sla.service';
import { KnexModule } from 'nest-knexjs';
import { mock } from 'jest-mock-extended';
import { Knex } from 'knex';

describe('FilingsService', () => {
  let service: FilingsService;
  let slaService: SlaService;
  let knex: Knex;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilingsService,
        SlaService,
        {
          provide: 'KnexConnection',
          useValue: mock<Knex>(),
        },
      ],
    }).compile();

    service = module.get<FilingsService>(FilingsService);
    slaService = module.get<SlaService>(SlaService);
    knex = module.get<Knex>('KnexConnection');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
