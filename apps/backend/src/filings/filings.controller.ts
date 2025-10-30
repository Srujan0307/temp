import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { FilingsService } from './filings.service';
import { CreateFilingDto } from './dto/create-filing.dto';
import { UpdateFilingDto } from './dto/update-filing.dto';
import { Audit } from '../common/logging/audit.decorator';
import { AuditInterceptor } from '../common/logging/audit.interceptor';

@Controller('filings')
@UseInterceptors(AuditInterceptor)
export class FilingsController {
  constructor(private readonly filingsService: FilingsService) {}

  @Post()
  @Audit('Created a new filing')
  create(@Body() createFilingDto: CreateFilingDto) {
    return this.filingsService.create(createFilingDto);
  }

  @Get()
  findAll() {
    return this.filingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filingsService.findOne(+id);
  }

  @Patch(':id')
  @Audit('Updated a filing')
  update(@Param('id') id: string, @Body() updateFilingDto: UpdateFilingDto) {
    return this.filingsService.update(+id, updateFilingDto);
  }

  @Delete(':id')
  @Audit('Deleted a filing')
  remove(@Param('id') id: string) {
    return this.filingsService.remove(+id);
  }
}
