
import { Test, TestingModule } from '@nestjs/testing';
import { FilingsGateway } from './filings.gateway';
import { FilingsService } from './filings.service';

describe('FilingsGateway', () => {
  let gateway: FilingsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilingsGateway,
        {
          provide: FilingsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<FilingsGateway>(FilingsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
