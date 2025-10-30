
import { Module } from '@nestjs/common';
import { FilingsController } from './filings.controller';
import { FilingsService } from './filings.service';

@Module({
  controllers: [FilingsController],
  providers: [FilingsService],
})
export class FilingsModule {}
