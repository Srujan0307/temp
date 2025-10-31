
import { Injectable } from '@nestjs/common';

@Injectable()
export class CalendarService {
  getEvents() {
    return 'This action returns all events with filters';
  }

  createEvent() {
    return 'This action adds a new event';
  }

  updateEvent(id: string) {
    return `This action updates a #${id} event`;
  }

  deleteEvent(id: string) {
    return `This action removes a #${id} event`;
  }
}
