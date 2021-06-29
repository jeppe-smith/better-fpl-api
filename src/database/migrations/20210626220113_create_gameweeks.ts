import * as Knex from 'knex';

const TABLE_NAME = 'gameweeks';

export async function up(knex: Knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.integer('id');
    t.integer('season_id').references('id').inTable('seasons');
    t.integer('average_entry_score').notNullable();
    t.boolean('data_checked').notNullable();
    t.dateTime('deadline').notNullable();
    t.integer('highest_score');
    t.string('name');
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
    t.primary(['id', 'season_id']);
  });
}

export async function down() {}
