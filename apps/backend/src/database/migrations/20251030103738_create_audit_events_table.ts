
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('audit_events', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.string('event_name').notNullable();
    table.jsonb('payload');
    table.timestamps(true, true);
    table.index(['user_id', 'event_name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('audit_events');
}
