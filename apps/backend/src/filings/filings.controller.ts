
import {
  Controller,
} from '@nestjs/common';
import { FilingsService } from './filings.service';

@Controller('filings')
export class FilingsController {
  constructor(private readonly filingsService: FilingsService) {}
}
