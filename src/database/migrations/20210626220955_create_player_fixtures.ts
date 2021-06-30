import * as Knex from 'knex';

const TABLE_NAME = 'player_fixtures';

export async function up(knex: Knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.integer('player_id').notNullable().references('id').inTable('players');
    t.integer('fixture_id').notNullable().references('id').inTable('fixtures');
    t.integer('season_id').notNullable().references('id').inTable('seasons');
    t.integer('assists').notNullable();
    t.integer('attempted_passes');
    t.integer('big_chances_created');
    t.integer('big_chances_missed');
    t.integer('bonus').notNullable();
    t.integer('bps').notNullable();
    t.integer('clean_sheets').notNullable();
    t.integer('clearances_blocks_interceptions');
    t.integer('completed_passes');
    t.decimal('creativity').notNullable();
    t.integer('dribbles');
    t.integer('errors_leading_to_goal');
    t.integer('errors_leading_to_goal_attempt');
    t.integer('fouls');
    t.integer('goals_conceded').notNullable();
    t.integer('goals_scored').notNullable();
    t.decimal('ict_index').notNullable();
    t.decimal('influence').notNullable();
    t.integer('key_passes');
    t.integer('minutes').notNullable();
    t.integer('offside');
    t.integer('open_play_crosses');
    t.integer('opponent_team').notNullable();
    t.integer('own_goals').notNullable();
    t.integer('penalties_conceded');
    t.integer('penalties_missed').notNullable();
    t.integer('penalties_saved').notNullable();
    t.integer('recoveries');
    t.integer('red_cards').notNullable();
    t.integer('saves').notNullable();
    t.integer('selected').notNullable();
    t.integer('tackled');
    t.integer('tackles');
    t.integer('target_missed');
    t.integer('team_a_score').notNullable();
    t.integer('team_h_score').notNullable();
    t.decimal('threat').notNullable();
    t.integer('total_points').notNullable();
    t.integer('transfers_balance').notNullable();
    t.integer('transfers_in').notNullable();
    t.integer('transfers_out').notNullable();
    t.integer('value').notNullable();
    t.boolean('was_home').notNullable();
    t.integer('winning_goals');
    t.integer('yellow_cards').notNullable();
    t.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
    t.primary(['player_id', 'fixture_id']);
  });
}

export async function down() {}
