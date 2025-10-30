
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('filings', (table) => {
    table.increments('id').primary();
    table
      .integer('tenant_id')
      .unsigned()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');
    table
      .integer('client_id')
      .unsigned()
      .references('id')
      .inTable('clients')
      .onDelete('CASCADE');
    table
        .integer('vehicle_id')
        .unsigned()
        .references('id')
        .inTable('vehicles')
        .onDelete('CASCADE');
    table
        .integer('status_id')
        .unsigned()
        .references('id')
        .inTable('filing_statuses')
        .onDelete('SET NULL');
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('filings');
}
