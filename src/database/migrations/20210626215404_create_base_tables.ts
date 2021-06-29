import * as Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema
    .createTable('seasons', (t) => {
      t.integer('id').primary();
      t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
      t.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
    })
    .then(() =>
      knex.schema.createTable('teams', (t) => {
        t.integer('id').primary();
        t.string('name').notNullable();
        t.string('short_name').notNullable();
        t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
        t.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
      }),
    )
    .then(() =>
      knex.schema.createTable('players', (t) => {
        t.integer('id').primary();
        t.string('first_name').notNullable();
        t.string('second_name').notNullable();
        t.string('web_name').notNullable();
        t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
        t.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
      }),
    );
}

export async function down() {}
