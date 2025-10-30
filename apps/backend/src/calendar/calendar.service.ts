
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vehicle } from '../vehicles/vehicle.entity';
import { CalendarEvent } from './calendar-event.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly calendarEventRepository: Repository<CalendarEvent>,
  ) {}

  async generateEventsForVehicle(vehicle: Vehicle): Promise<CalendarEvent[]> {
    const events: Partial<CalendarEvent>[] = [];

    if (vehicle.category === 'truck') {
      events.push({
        title: 'Annual Inspection',
        dueDate: new Date(new Date().getFullYear() + 1, 0, 1),
        vehicle,
      });
      events.push({
        title: 'Q1 Maintenance',
        dueDate: new Date(new Date().getFullYear(), 3, 1),
        vehicle,
      });
      events.push({
        title: 'Q3 Maintenance',
        dueDate: new Date(new Date().getFullYear(), 9, 1),
        vehicle,
      });
    } else if (vehicle.category === 'van') {
      events.push({
        title: 'Semi-Annual Inspection',
        dueDate: new Date(new Date().getFullYear(), 5, 1),
        vehicle,
      });
    }

    return this.calendarEventRepository.save(events);
  }
}
