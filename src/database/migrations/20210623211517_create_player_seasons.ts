import * as Knex from 'knex';

const TABLE_NAME = 'player_seasons';

export async function up(knex: Knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.bigIncrements('id');
    t.dateTime('created_at').notNullable();
    t.dateTime('updated_at').notNullable();
    t.integer('player_code').notNullable()
    t.integer('season').notNullable()
    t.json('gameweeks').notNullable()
    t.unique(['player_code', 'season'])
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(TABLE_NAME);
}
