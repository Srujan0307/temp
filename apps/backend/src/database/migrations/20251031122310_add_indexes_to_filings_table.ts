import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('filings', (table) => {
    table.index('tenant_id');
    table.index('client_id');
    table.index('vehicle_id');
    table.index('status_id');
    table.index('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('filings', (table) => {
    table.dropIndex('tenant_id');
    table.dropIndex('client_id');
    table.dropIndex('vehicle_id');
    table.dropIndex('status_id');
    table.dropIndex('deleted_at');
  });
}
