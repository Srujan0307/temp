
import { Test, TestingModule } from '@nestjs/testing';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

describe('VehiclesController', () => {
  let controller: VehiclesController;

  const mockVehiclesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<VehiclesController>(VehiclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a vehicle', async () => {
    const dto: CreateVehicleDto = {
      vehicleType: 'truck',
      category: 'heavy',
      regulatoryRegime: 'epa',
      complianceCalendarTemplate: 'default',
    };
    await controller.create(dto);
    expect(mockVehiclesService.create).toHaveBeenCalledWith(dto);
  });

  it('should find all vehicles', async () => {
    await controller.findAll();
    expect(mockVehiclesService.findAll).toHaveBeenCalled();
  });

  it('should find one vehicle', async () => {
    const id = 'some-id';
    await controller.findOne(id);
    expect(mockVehiclesService.findOne).toHaveBeenCalledWith(id);
  });

  it('should update a vehicle', async () => {
    const id = 'some-id';
    const dto: UpdateVehicleDto = {
      vehicleType: 'truck',
    };
    await controller.update(id, dto);
    expect(mockVehiclesService.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove a vehicle', async () => {
    const id = 'some-id';
    await controller.remove(id);
    expect(mockVehiclesService.remove).toHaveBeenCalledWith(id);
  });
});
