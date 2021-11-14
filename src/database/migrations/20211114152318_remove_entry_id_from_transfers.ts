import * as Knex from 'knex';

const TABLE_NAME = 'transfers';

export async function up(knex: Knex) {
  return knex.schema.table(TABLE_NAME, (t) => {
    t.dropColumn('entry_id');
  });
}

export async function down() {}
