import { Controller, Param, Patch, Body, UseInterceptors } from '@nestjs/common';
import { FilingStageService } from './filing-stage.service';
import { UpdateFilingStageDto } from './dto/update-filing-stage.dto';
import { Audit } from '../common/logging/audit.decorator';
import { AuditInterceptor } from '../common/logging/audit.interceptor';

@Controller('filings/:id/stage')
@UseInterceptors(AuditInterceptor)
export class FilingStageController {
  constructor(private readonly filingStageService: FilingStageService) {}

  @Patch()
  @Audit('Transitioned filing stage')
  transition(
    @Param('id') id: string,
    @Body() updateFilingStageDto: UpdateFilingStageDto,
  ) {
    return this.filingStageService.transition(+id, updateFilingStageDto.stage);
  }
}
