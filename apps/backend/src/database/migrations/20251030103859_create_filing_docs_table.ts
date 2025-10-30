
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('filing_docs', (table) => {
    table.increments('id').primary();
    table
      .integer('tenant_id')
      .unsigned()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');
    table
      .integer('filing_id')
      .unsigned()
      .references('id')
      .inTable('filings')
      .onDelete('CASCADE');
    table.string('document_name').notNullable();
    table.string('document_url').notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('filing_docs');
}
