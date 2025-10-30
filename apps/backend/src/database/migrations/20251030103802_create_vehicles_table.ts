
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('vehicles', (table) => {
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
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('vehicle_categories')
        .onDelete('SET NULL');
    table.string('make').notNullable();
    table.string('model').notNullable();
    table.integer('year').notNullable();
    table.string('vin').notNullable();
    table.unique(['vin', 'tenant_id']);
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('vehicles');
}
