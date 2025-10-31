import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'nest-knexjs';
import { Knex } from 'knex';
import { Filing, FilingStage } from './filing.entity';
import { FilingsGateway } from './filings.gateway';

@Injectable()
export class FilingStageService {
  private readonly stageTransitions: Record<FilingStage, FilingStage[]> = {
    [FilingStage.DRAFT]: [FilingStage.IN_REVIEW],
    [FilingStage.IN_REVIEW]: [FilingStage.APPROVED, FilingStage.DRAFT],
    [FilingStage.APPROVED]: [FilingStage.SUBMITTED],
    [FilingStage.SUBMITTED]: [FilingStage.ARCHIVED],
    [FilingStage.ARCHIVED]: [],
  };

  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly filingsGateway: FilingsGateway,
  ) {}

  async transition(id: number, newStage: FilingStage): Promise<Filing> {
    const filing = await this.knex('filings').where({ id }).first();

    if (!filing) {
      throw new BadRequestException('Filing not found');
    }

    const currentStage = filing.stage;
    const allowedTransitions = this.stageTransitions[currentStage];

    if (!allowedTransitions.includes(newStage)) {
      throw new BadRequestException(
        `Invalid stage transition from ${currentStage} to ${newStage}`,
      );
    }

    const [updatedFiling] = await this.knex('filings')
      .where({ id })
      .update({ stage: newStage })
      .returning('*');

    this.filingsGateway.server.emit('filing.moved', updatedFiling);

    return updatedFiling;
  }
}
