import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('clients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.jsonb('registration_numbers');
    table.jsonb('contact_details');
    table.jsonb('categories');
    table.jsonb('custom_metadata');
    table
      .uuid('tenant_id')
      .references('id')
      .inTable('tenants')
      .onDelete('CASCADE');
    table
      .uuid('logo_id')
      .references('id')
      .inTable('documents')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('user_assignments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .uuid('client_id')
      .references('id')
      .inTable('clients')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_assignments');
  await knex.schema.dropTableIfExists('clients');
}
