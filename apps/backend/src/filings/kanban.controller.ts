import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { KanbanService } from './kanban.service';
import { ContextService } from '../common/context/context.service';
import { UpdateFilingStageDto } from './dtos/update-filing-stage.dto';

@Controller('filings')
export class KanbanController {
  constructor(
    private readonly kanbanService: KanbanService,
    private readonly contextService: ContextService,
  ) {}

  @Get('kanban')
  getBoard(
    @Query('clientId') clientId: string,
    @Query('vehicleId') vehicleId: string,
    @Query('assigneeId') assigneeId: string,
    @Query('slaStatus') slaStatus: string,
    @Query('search') search: string,
  ) {
    return this.kanbanService.getBoard({
      tenantId: this.contextService.getTenantId(),
      clientId,
      vehicleId,
      assigneeId,
      slaStatus,
      search,
    });
  }

  @Patch(':id/stage')
  updateStage(
    @Param('id') id: string,
    @Body() updateFilingStageDto: UpdateFilingStageDto,
  ) {
    return this.kanbanService.updateStage(
      id,
      this.contextService.getTenantId(),
      updateFilingStageDto,
    );
  }
}
