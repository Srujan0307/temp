import { Knex } from 'knex';
import { FilingStage, SlaStatus } from '../../filings/filing.entity';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('filings', (table) => {
    table.string('type').notNullable();
    table.date('due_date').notNullable();
    table.enum('stage', Object.values(FilingStage)).notNullable().defaultTo(FilingStage.DRAFT);
    table.enum('sla_status', Object.values(SlaStatus)).notNullable().defaultTo(SlaStatus.ON_TRACK);
    table
      .integer('assigned_to')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('filings', (table) => {
    table.dropColumn('type');
    table.dropColumn('due_date');
    table.dropColumn('stage');
    table.dropColumn('sla_status');
    table.dropColumn('assigned_to');
  });
}
