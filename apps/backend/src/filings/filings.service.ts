import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'nest-knexjs';
import { Knex } from 'knex';
import { Filing } from './filing.entity';
import { SlaService } from './sla.service';

@Injectable()
export class FilingsService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly slaService: SlaService,
  ) {}

  async create(filing: Partial<Filing>): Promise<Filing> {
    const [newFiling] = await this.knex('filings').insert(filing).returning('*');
    return this.slaService.updateSlaStatus(newFiling);
  }

  async findAll(): Promise<Filing[]> {
    return this.knex('filings').select('*');
  }

  async findOne(id: number): Promise<Filing> {
    return this.knex('filings').where({ id }).first();
  }

  async update(id: number, filing: Partial<Filing>): Promise<Filing> {
    const [updatedFiling] = await this.knex('filings')
      .where({ id })
      .update(filing)
      .returning('*');
    return this.slaService.updateSlaStatus(updatedFiling);
  }

  async remove(id: number): Promise<void> {
    await this.knex('filings').where({ id }).del();
  }
}
