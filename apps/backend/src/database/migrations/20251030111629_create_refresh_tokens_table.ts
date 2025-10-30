
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('refresh_tokens', (table) => {
    table.increments('id').primary();
    table.string('token').notNullable().unique();
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamp('expires_at').notNullable();
    table.timestamps(true, true);
    table.boolean('is_revoked').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('refresh_tokens');
}
