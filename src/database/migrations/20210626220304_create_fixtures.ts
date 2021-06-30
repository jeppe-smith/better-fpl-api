import * as Knex from 'knex';

const TABLE_NAME = 'fixtures';

export async function up(knex: Knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.integer('id').primary();
    t.integer('away_team_id').notNullable().references('id').inTable('teams');
    t.boolean('finished').notNullable();
    t.boolean('finished_provisional').notNullable();
    t.integer('gameweek_id').notNullable();
    t.integer('home_team_id').notNullable().references('id').inTable('teams');
    t.dateTime('kickoff').notNullable();
    t.integer('number').notNullable();
    t.integer('season_id').notNullable().references('id').inTable('seasons');
    t.boolean('started').notNullable();
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
    t.foreign(['gameweek_id', 'season_id'])
      .references(['id', 'season_id'])
      .inTable('gameweeks');
  });
}

export async function down() {}
