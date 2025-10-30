
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CalendarEvent } from './calendar-event.entity';
import { CalendarService } from './calendar.service';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEvent])],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
