
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CalendarService } from '../calendar/calendar.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly calendarService: CalendarService,
  ) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.save(dto);
    await this.calendarService.generateEventsForVehicle(vehicle);
    return vehicle;
  }

  async findOne(id: string): Promise<Vehicle> {
    return this.vehicleRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find();
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    return this.vehicleRepository.save({ id, ...dto });
  }

  async remove(id: string): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
}
