import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANT_CONNECTION } from '../../database/constants';

export class BaseRepository<T> {
  @Inject(TENANT_CONNECTION) protected readonly knex: Knex;

  constructor(private readonly table: string) {}

  protected get queryBuilder(): Knex.QueryBuilder {
    return this.knex(this.table);
  }

  async findById(id: number | string): Promise<T> {
    return this.queryBuilder.where({ id }).first();
  }

  async findAll(): Promise<T[]> {
    return this.queryBuilder.select();
  }

  async create(item: Partial<T>): Promise<T> {
    const [output] = await this.queryBuilder.insert(item).returning('*');
    return output;
  }

  async update(id: number | string, item: Partial<T>): Promise<T> {
    const [output] = await this.queryBuilder
      .where({ id })
      .update(item)
      .returning('*');
    return output;
  }

  async delete(id: number | string): Promise<void> {
    await this.queryBuilder.where({ id }).del();
  }
}
