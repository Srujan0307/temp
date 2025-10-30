import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { UserAssignment } from './user-assignment.entity';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';

describe('ClientsService', () => {
  let service: ClientsService;

  const mockClientsRepository = {};
  const mockUserAssignmentsRepository = {};
  const mockStorageService = {};
  const mockUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientsRepository,
        },
        {
          provide: getRepositoryToken(UserAssignment),
          useValue: mockUserAssignmentsRepository,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
