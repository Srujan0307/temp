
import { Controller, Get, Post, Patch, Delete, Query, Body, Param } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  getEvents(
    @Query('view') view: string,
    @Query('clientId') clientId: string,
    @Query('vehicleId') vehicleId: string,
    @Query('eventType') eventType: string,
    @Query('slaStatus') slaStatus: string,
  ) {
    return this.calendarService.getEvents();
  }

  @Post('events')
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.calendarService.createEvent();
  }

  @Patch('events/:id')
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.calendarService.updateEvent(id);
  }

  @Delete('events/:id')
  deleteEvent(@Param('id') id: string) {
    return this.calendarService.deleteEvent(id);
  }
}
