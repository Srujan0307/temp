
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('filing_docs', (table) => {
    table.increments('id').primary();
    table.integer('filing_id').notNullable().references('id').inTable('filings');
    table.integer('file_object_id').notNullable().references('id').inTable('file_objects');
    table.integer('version').notNullable();
    table.integer('tenant_id').notNullable().references('id').inTable('tenants');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('filing_docs');
}
