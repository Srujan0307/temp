import { Module } from '@nestjs/common';
import { FilingsController } from './filings.controller';
import { FilingsService } from './filings.service';
import { FilingStageController } from './filing-stage.controller';
import { FilingStageService } from './filing-stage.service';

import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';
import { SlaService } from './sla.service';

import { FilingsGateway } from './filings.gateway';

@Module({
  controllers: [FilingsController, FilingStageController, KanbanController],
  providers: [
    FilingsService,
    FilingStageService,
    KanbanService,
    SlaService,
    FilingsGateway,
  ],
})
export class FilingsModule {}
