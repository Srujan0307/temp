
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenant_settings', (table) => {
    table.increments('id').primary();
    table
      .integer('tenant_id')
      .unsigned()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE')
      .unique();
    table.jsonb('settings');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tenant_settings');
}
