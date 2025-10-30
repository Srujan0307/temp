import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('file_objects', (table) => {
    table.increments('id').primary();
    table.string('file_name').notNullable();
    table.string('s3_key').notNullable().unique();
    table.string('mime_type').notNullable();
    table.integer('size').notNullable();
    table
      .enum('status', ['pending_scan', 'clean', 'quarantined'])
      .notNullable()
      .defaultTo('pending_scan');
    table.integer('tenant_id').notNullable().references('id').inTable('tenants');
    table.integer('client_id').references('id').inTable('clients');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('file_objects');
}
