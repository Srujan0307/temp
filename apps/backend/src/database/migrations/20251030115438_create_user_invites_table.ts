import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_invites', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable();
    table.string('role').notNullable();
    table.integer('tenant_id').unsigned().references('id').inTable('tenants').onDelete('CASCADE');
    table.string('token').notNullable().unique();
    table.timestamps(true, true);

    table.index('token');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_invites');
}
