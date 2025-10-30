
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CalendarService } from '../calendar/calendar.service';
import { Vehicle } from './vehicle.entity';
import { VehiclesService } from './vehicles.service';

describe('VehiclesService', () => {
  let service: VehiclesService;

  const mockVehicleRepository = {
    save: jest.fn(),
  };

  const mockCalendarService = {
    generateEventsForVehicle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockVehicleRepository,
        },
        {
          provide: CalendarService,
          useValue: mockCalendarService,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a vehicle and generate calendar events', async () => {
    const dto = {
      vehicleType: 'truck',
      category: 'heavy',
      regulatoryRegime: 'epa',
      complianceCalendarTemplate: 'default',
    };
    const vehicle = { id: 'some-id', ...dto };
    mockVehicleRepository.save.mockResolvedValue(vehicle);

    await service.create(dto as any);

    expect(mockVehicleRepository.save).toHaveBeenCalledWith(dto);
    expect(mockCalendarService.generateEventsForVehicle).toHaveBeenCalledWith(
      vehicle,
    );
  });
});
