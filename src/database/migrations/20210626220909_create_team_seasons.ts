import * as Knex from 'knex';

const TABLE_NAME = 'team_seasons';

export async function up(knex: Knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.integer('id').notNullable();
    t.integer('team_id').notNullable().references('id').inTable('teams');
    t.integer('season_id').notNullable().references('id').inTable('seasons');
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
    t.unique(['id', 'team_id', 'season_id']);
  });
}

export async function down() {}
