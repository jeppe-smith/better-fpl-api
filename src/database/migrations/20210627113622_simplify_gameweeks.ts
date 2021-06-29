import * as Knex from 'knex';

const TABLE_NAME = 'gameweeks';

export async function up(knex: Knex) {
  return knex.schema.table(TABLE_NAME, (t) => {
    t.integer('average_entry_score').nullable().alter();
    t.boolean('data_checked').nullable().alter();
    t.dateTime('deadline').nullable().alter();
  });
}

export async function down() {}
