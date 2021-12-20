import * as Knex from 'knex';

const TABLE_NAME = 'player_fixtures';

export async function up(knex: Knex) {
  return knex.schema.table(TABLE_NAME, (t) => {
    t.string('status').nullable();
    t.decimal('chance_of_playing', 2, 1).defaultTo(1).notNullable();
  });
}

export async function down() {}
