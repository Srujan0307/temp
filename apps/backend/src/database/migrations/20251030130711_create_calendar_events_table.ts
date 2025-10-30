import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('calendar_events', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('title').notNullable();
    table.date('due_date').notNullable();
    table.uuid('vehicle_id').references('id').inTable('vehicles');
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('calendar_events');
}
