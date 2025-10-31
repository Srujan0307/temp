import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from 'nest-knexjs';
import { Knex } from 'knex';
import { Filing } from './filing.entity';
import { SlaService } from './sla.service';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class FilingsService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly slaService: SlaService,
    private readonly redisService: RedisService,
  ) {}

  async create(filing: Partial<Filing>): Promise<Filing> {
    const [newFiling] = await this.knex('filings').insert(filing).returning('*');
    await this.redisService.getClient().del('filings');
    return this.slaService.updateSlaStatus(newFiling);
  }

  async findAll(): Promise<Filing[]> {
    const cacheKey = 'filings';
    const client = this.redisService.getClient();
    const cachedFilings = await client.get(cacheKey);

    if (cachedFilings) {
      return JSON.parse(cachedFilings);
    }

    const filings = await this.knex('filings').select('*');
    await client.set(cacheKey, JSON.stringify(filings), 'EX', 3600); // Cache for 1 hour
    return filings;
  }

  async findOne(id: number): Promise<Filing> {
    return this.knex('filings').where({ id }).first();
  }

  async update(id: number, filing: Partial<Filing>): Promise<Filing> {
    const [updatedFiling] = await this.knex('filings')
      .where({ id })
      .update(filing)
      .returning('*');
    await this.redisService.getClient().del('filings');
    return this.slaService.updateSlaStatus(updatedFiling);
  }

  async remove(id: number): Promise<void> {
    await this.knex('filings').where({ id }).del();
    await this.redisService.getClient().del('filings');
  }
}
