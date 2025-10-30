
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('calendar_events', (table) => {
    table.increments('id').primary();
    table
      .integer('tenant_id')
      .unsigned()
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description');
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('calendar_events');
}
