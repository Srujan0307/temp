
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('document_requests', (table) => {
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
    table
      .integer('client_id')
      .unsigned()
      .references('id')
      .inTable('clients')
      .onDelete('CASCADE');
    table
        .integer('status_id')
        .unsigned()
        .references('id')
        .inTable('document_request_statuses')
        .onDelete('SET NULL');
    table.text('request_details');
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('document_requests');
}
