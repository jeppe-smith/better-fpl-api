import * as Knex from 'knex';

const TABLE_NAME = 'transfers';

export async function up(knex: Knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.increments('id');
    t.string('chip').nullable();
    t.integer('entry_id').notNullable();
    t.integer('gameweek_id').notNullable();
    t.integer('player_in').notNullable();
    t.integer('player_out').notNullable();
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down() {}
