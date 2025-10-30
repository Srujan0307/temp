import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'nest-knexjs';
import { Knex } from 'knex';
import { Filing, FilingStage } from './filing.entity';

interface KanbanColumn {
  stage: FilingStage;
  filings: Filing[];
  count: number;
}

@Injectable()
export class KanbanService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async getBoard(): Promise<KanbanColumn[]> {
    const filings = await this.knex('filings').select('*');
    const groupedByStage = filings.reduce((acc, filing) => {
      if (!acc[filing.stage]) {
        acc[filing.stage] = [];
      }
      acc[filing.stage].push(filing);
      return acc;
    }, {} as Record<FilingStage, Filing[]>);

    const columns = Object.values(FilingStage).map((stage) => ({
      stage,
      filings: groupedByStage[stage] || [],
      count: (groupedByStage[stage] || []).length,
    }));

    return columns;
  }
}
