import { Knex } from 'knex';

export abstract class SoftDeletesRepository<T> {
  protected abstract readonly knex: Knex;
  protected abstract readonly table: string;

  protected get queryBuilder(): Knex.QueryBuilder {
    return this.knex(this.table).whereNull('deleted_at');
  }

  async findById(id: number | string): Promise<T> {
    return this.queryBuilder.where({ id }).first();
  }

  async findAll(): Promise<T[]> {
    return this.queryBuilder.select();
  }

  async softDelete(id: number | string): Promise<void> {
    await this.knex(this.table)
      .where({ id })
      .update({ deleted_at: new Date() });
  }

  async restore(id: number | string): Promise<void> {
    await this.knex(this.table).where({ id }).update({ deleted_at: null });
  }

  async findWithTrashed(id: number | string): Promise<T> {
    return this.knex(this.table).where({ id }).first();
  }

  async findOnlyTrashed(id: number | string): Promise<T> {
    return this.knex(this.table)
      .where({ id })
      .whereNotNull('deleted_at')
      .first();
  }
}
