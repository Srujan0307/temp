import { Controller, Get } from '@nestjs/common';
import { KanbanService } from './kanban.service';

@Controller('filings/kanban')
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Get()
  getBoard() {
    return this.kanbanService.getBoard();
  }
}
