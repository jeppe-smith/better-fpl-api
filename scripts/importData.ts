import 'dotenv/config';

import * as parseCsv from 'neat-csv';
import * as Knex from 'knex';
import * as path from 'path';
import * as fs from 'fs/promises';
import { SeasonModel } from '../src/database/models/season.model';
import { PlayerModel } from '../src/database/models/player.model';
import { ModelObject, PartialModelObject } from 'objection';
import { TeamModel } from '../src/database/models/team.model';
import { FixtureModel } from '../src/database/models/fixture.model';
import { GameweekModel } from '../src/database/models/gameweeks.model';
import { TeamSeasonModel } from '../src/database/models/team-season.model';
import { PlayerFixtureModel } from '../src/database/models/player-fixture.model';
import { PlayerSeasonModel } from '../src/database/models/player-season.model';

interface Season {
  id: number;
  name: string;
}

const knex = Knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  debug: true,
});

const seasons: Season[] = [
  { id: 2016, name: '2016-17' },
  { id: 2017, name: '2017-18' },
  { id: 2018, name: '2018-19' },
  { id: 2019, name: '2019-20' },
  { id: 2020, name: '2020-21' },
];

const teams = [
  { id: 3, name: 'Arsenal', short_name: 'ARS' },
  { id: 7, name: 'Aston Villa', short_name: 'AVL' },
  { id: 36, name: 'Brighton', short_name: 'BHA' },
  { id: 90, name: 'Burnley', short_name: 'BUR' },
  { id: 8, name: 'Chelsea', short_name: 'CHE' },
  { id: 31, name: 'Crystal Palace', short_name: 'CRY' },
  { id: 11, name: 'Everton', short_name: 'EVE' },
  { id: 54, name: 'Fulham', short_name: 'FUL' },
  { id: 13, name: 'Leicester', short_name: 'LEI' },
  { id: 2, name: 'Leeds', short_name: 'LEE' },
  { id: 14, name: 'Liverpool', short_name: 'LIV' },
  { id: 43, name: 'Man City', short_name: 'MCI' },
  { id: 1, name: 'Man Utd', short_name: 'MUN' },
  { id: 4, name: 'Newcastle', short_name: 'NEW' },
  { id: 49, name: 'Sheffield Utd', short_name: 'SHU' },
  { id: 20, name: 'Southampton', short_name: 'SOU' },
  { id: 6, name: 'Spurs', short_name: 'TOT' },
  { id: 35, name: 'West Brom', short_name: 'WBA' },
  { id: 21, name: 'West Ham', short_name: 'WHU' },
  { id: 39, name: 'Wolves', short_name: 'WOL' },
  { id: 91, name: 'Bournemouth', short_name: 'BOU' },
  { id: 88, name: 'Hull', short_name: 'HUL' },
  { id: 25, name: 'Middlesbrough', short_name: 'MID' },
  { id: 110, name: 'Stoke', short_name: 'STK' },
  { id: 56, name: 'Sunderland', short_name: 'SUN' },
  { id: 80, name: 'Swansea', short_name: 'SWA' },
  { id: 57, name: 'Watford', short_name: 'WAT' },
  { id: 38, name: 'Huddersfield', short_name: 'HUD' },
  { id: 97, name: 'Cardiff', short_name: 'CAR' },
  { id: 45, name: 'Norwich', short_name: 'NOR' },
  { id: 94, name: 'Brentford', short_name: 'BRE' },
];

async function main() {
  const _season = seasons[0];

  await SeasonModel.query(knex).insert(
    seasons.map<PartialModelObject<SeasonModel>>((season) => {
      return {
        id: season.id,
      };
    }),
  );

  await TeamModel.query(knex).insert(
    teams.map<PartialModelObject<TeamModel>>((team) => {
      return {
        id: team.id,
        name: team.name,
        shortName: team.short_name,
      };
    }),
  );

  await importSeason(_season);

  process.exit(0);
}

async function importSeason(_season: Season) {
  const _players = await getPlayers(_season);
  const _gameweeks = await getGameweeks(_season);
  const _fixtures = await getFixtures(_season);
  const _teamSeasons = await getTeamSeasons(_season);

  await PlayerModel.query(knex)
    .insert(
      _players.map<PartialModelObject<PlayerModel>>((_player) => {
        return {
          firstName: _player.first_name,
          secondName: _player.second_name,
          webName: _player.web_name,
          id: parseInt(_player.code),
        };
      }),
    )
    .onConflict('id')
    .ignore();

  const playerSeasons = await PlayerSeasonModel.query(knex).insert(
    _players.map<PartialModelObject<PlayerSeasonModel>>((_player) => {
      return {
        id: parseInt(_player.id),
        playerId: parseInt(_player.code),
        seasonId: _season.id,
      };
    }),
  );

  await GameweekModel.query(knex).insert(
    _gameweeks.map<PartialModelObject<GameweekModel>>((_gameweek) => {
      return {
        id: _gameweek,
        seasonId: _season.id,
      };
    }),
  );

  const teamSeasons = await TeamSeasonModel.query(knex).insert(_teamSeasons);

  const fixtures = await FixtureModel.query(knex).insert(
    _fixtures.map<PartialModelObject<FixtureModel>>((_fixture) => {
      return {
        id: _fixture.code,
        awayTeamId: teamSeasons.find((ts) => ts.id === _fixture.team_a)!.teamId,
        homeTeamId: teamSeasons.find((ts) => ts.id === _fixture.team_h)!.teamId,
        finished: true,
        finishedProvisional: true,
        gameweekId: _fixture.event,
        kickoff: _fixture.kickoff_time,
        number: _fixture.id,
        started: true,
        seasonId: _season.id,
      };
    }),
  );

  const _playersFixtures = await Promise.all(
    playerSeasons.map(async (playerSeason) => {
      const _player = _players.find(({ id }) => playerSeason.id)!;

      return await getPlayerFixtures(_player, _season, playerSeason, fixtures);
    }),
  );

  await Promise.all(
    _playersFixtures.map((_playerFixtures) =>
      PlayerFixtureModel.query(knex).insert(_playerFixtures),
    ),
  );
}

async function getFixtures(season: Season): Promise<any[]> {
  const json = await fs.readFile(
    path.join(__dirname, 'data', season.id.toString(), 'fixtures.json'),
    'utf-8',
  );

  return JSON.parse(json);
}

async function getGameweeks(season: Season) {
  const files = await fs.readdir(
    path.join(__dirname, 'tmp/data', season.name, 'gws'),
  );

  return files
    .map((file) => parseInt(file.match(/\d+/g)?.[0] || ''))
    .filter((v) => !Number.isNaN(v))
    .sort((a, b) => a - b);
}

async function getTeamSeasons(season: Season) {
  const players = await getPlayers(season);

  return players
    .map<PartialModelObject<TeamModel>>((player) => {
      return {
        id: parseInt(player.team),
        teamId: parseInt(player.team_code),
        seasonId: season.id,
      };
    })
    .reduce<PartialModelObject<TeamModel>[]>(
      (all, current) =>
        all.some((team) => team.id === current.id) ? all : [...all, current],
      [],
    );
}

async function getPlayerFixtures(
  _player: any,
  season: Season,
  playerSeason: ModelObject<PlayerSeasonModel>,
  fixtures: ModelObject<FixtureModel>[],
) {
  let id = `${_player.first_name}_${_player.second_name}`;

  if (season.id >= 2018) {
    id += _player.id;
  }

  const _playerFixtures = await parseCsv(
    await fs.readFile(
      path.join(__dirname, 'tmp/data', season.name, 'players', id, 'gw.csv'),
      'utf-8',
    ),
  );

  return _playerFixtures.map<PartialModelObject<PlayerFixtureModel>>((pf) => {
    return {
      playerId: playerSeason.playerId,
      fixtureId: fixtures.find(
        (f) => f.seasonId === season.id && f.number === Number(pf.fixture),
      )!.id,
      assists: Number(pf.assists),
      attemptedPasses: Number(pf.attempted_passes),
      bigChancesCreated: Number(pf.big_chances_created),
      bigChancesMissed: Number(pf.big_chances_missed),
      bonus: Number(pf.bonus),
      bps: Number(pf.bps),
      cleanSheets: Number(pf.clean_sheets),
      clearancesBlocksInterceptions: Number(pf.clearances_blocks_interceptions),
      completedPasses: Number(pf.completed_passes),
      creativity: Number(pf.creativity),
      dribbles: Number(pf.dribbles),
      errorsLeadingToGoal: Number(pf.errors_leading_to_goal),
      errorsLeadingToGoalAttempt: Number(pf.errors_leading_to_goal_attempt),
      fouls: Number(pf.fouls),
      goalsConceded: Number(pf.goals_conceded),
      goalsScored: Number(pf.goals_scored),
      ictIndex: Number(pf.ict_index),
      influence: Number(pf.influence),
      keyPasses: Number(pf.key_passes),
      loanedIn: Number(pf.loaned_in),
      loanedOut: Number(pf.loaned_out),
      minutes: Number(pf.minutes),
      offside: Number(pf.offside),
      openPlayCrosses: Number(pf.open_play_crosses),
      opponentTeam: Number(pf.opponent_team),
      ownGoals: Number(pf.own_goals),
      penaltiesConceded: Number(pf.penalties_conceded),
      penaltiesMissed: Number(pf.penalties_missed),
      penaltiesSaved: Number(pf.penalties_saved),
      recoveries: Number(pf.recoveries),
      redCards: Number(pf.red_cards),
      number: Number(pf.round),
      saves: Number(pf.saves),
      selected: Number(pf.selected),
      tackled: Number(pf.tackled),
      tackles: Number(pf.tackles),
      targetMissed: Number(pf.target_missed),
      team_a_score: Number(pf.team_a_score),
      team_h_score: Number(pf.team_h_score),
      threat: Number(pf.threat),
      totalPoints: Number(pf.total_points),
      transfersBalance: Number(pf.transfers_balance),
      transfersIn: Number(pf.transfers_in),
      transfersOut: Number(pf.transfers_out),
      value: Number(pf.value),
      wasHome: Boolean(pf.was_home),
      winningGoals: Number(pf.winning_goals),
      yellowCards: Number(pf.yellow_cards),
    };
  });
}

async function getPlayers(season: Season) {
  return await parseCsv(
    await fs.readFile(
      path.join(__dirname, 'tmp/data', season.name, 'players_raw.csv'),
      'utf-8',
    ),
  );
}

main();
