import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'nest-knexjs';
import { Knex } from 'knex';
import { Filing, SlaStatus } from './filing.entity';

@Injectable()
export class SlaService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async updateSlaStatus(filing: Filing): Promise<Filing> {
    const slaStatus = this.calculateSlaStatus(filing.due_date);

    if (filing.sla_status === slaStatus) {
      return filing;
    }

    const [updatedFiling] = await this.knex('filings')
      .where({ id: filing.id })
      .update({ sla_status: slaStatus })
      .returning('*');

    return updatedFiling;
  }

  private calculateSlaStatus(dueDate: Date): SlaStatus {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return SlaStatus.OFF_TRACK;
    }

    if (days <= 7) {
      return SlaStatus.AT_RISK;
    }

    return SlaStatus.ON_TRACK;
  }
}
