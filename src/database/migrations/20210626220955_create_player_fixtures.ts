import * as Knex from 'knex';

const TABLE_NAME = 'player_fixtures';

export async function up(knex: Knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.integer('player_id').references('id').inTable('players');
    t.integer('fixture_id').references('id').inTable('fixtures');
    t.integer('assists').notNullable();
    t.integer('attempted_passes').notNullable();
    t.integer('big_chances_created').notNullable();
    t.integer('big_chances_missed').notNullable();
    t.integer('bonus').notNullable();
    t.integer('bps').notNullable();
    t.integer('clean_sheets').notNullable();
    t.integer('clearances_blocks_interceptions').notNullable();
    t.integer('completed_passes').notNullable();
    t.decimal('creativity').notNullable();
    t.integer('dribbles').notNullable();
    t.integer('errors_leading_to_goal').notNullable();
    t.integer('errors_leading_to_goal_attempt').notNullable();
    t.integer('fouls').notNullable();
    t.integer('goals_conceded').notNullable();
    t.integer('goals_scored').notNullable();
    t.decimal('ict_index').notNullable();
    t.decimal('influence').notNullable();
    t.integer('key_passes').notNullable();
    t.integer('loaned_in').notNullable();
    t.integer('loaned_out').notNullable();
    t.integer('number').notNullable();
    t.integer('minutes').notNullable();
    t.integer('offside').notNullable();
    t.integer('open_play_crosses').notNullable();
    t.integer('opponent_team').notNullable();
    t.integer('own_goals').notNullable();
    t.integer('penalties_conceded').notNullable();
    t.integer('penalties_missed').notNullable();
    t.integer('penalties_saved').notNullable();
    t.integer('recoveries').notNullable();
    t.integer('red_cards').notNullable();
    t.integer('saves').notNullable();
    t.integer('selected').notNullable();
    t.integer('tackled').notNullable();
    t.integer('tackles').notNullable();
    t.integer('target_missed').notNullable();
    t.integer('team_a_score').notNullable();
    t.integer('team_h_score').notNullable();
    t.decimal('threat').notNullable();
    t.integer('total_points').notNullable();
    t.integer('transfers_balance').notNullable();
    t.integer('transfers_in').notNullable();
    t.integer('transfers_out').notNullable();
    t.integer('value').notNullable();
    t.boolean('was_home').notNullable();
    t.integer('winning_goals').notNullable();
    t.integer('yellow_cards').notNullable();
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
    t.primary(['player_id', 'fixture_id']);
  });
}

export async function down() {}
