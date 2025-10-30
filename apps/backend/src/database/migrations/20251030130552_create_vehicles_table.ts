import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('vehicles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('vehicle_type').notNullable();
    table.text('category').notNullable();
    table.text('regulatory_regime').notNullable();
    table.text('compliance_calendar_template').notNullable();
    table.uuid('client_id').references('id').inTable('clients');
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('vehicles');
}
