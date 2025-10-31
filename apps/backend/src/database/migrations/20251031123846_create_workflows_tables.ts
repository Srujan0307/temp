import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('workflow_templates', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('workflow_template_stages', (table) => {
    table.increments('id').primary();
    table
      .integer('workflow_template_id')
      .unsigned()
      .references('id')
      .inTable('workflow_templates')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.integer('order').notNullable();
    table.jsonb('required_roles').notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('workflow_instances', (table) => {
    table.increments('id').primary();
    table
      .integer('workflow_template_id')
      .unsigned()
      .references('id')
      .inTable('workflow_templates')
      .onDelete('CASCADE');
    table.string('status').notNullable();
    table
      .integer('filing_id')
      .unsigned()
      .references('id')
      .inTable('filings')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('workflow_instances');
  await knex.schema.dropTableIfExists('workflow_template_stages');
  await knex.schema.dropTableIfExists('workflow_templates');
}

