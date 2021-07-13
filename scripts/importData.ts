import 'dotenv/config';

import * as parseCsv from 'neat-csv';
import * as downloadGitRepo from 'download-git-repo';
import * as Knex from 'knex';
import * as path from 'path';
import * as fs from 'fs/promises';
import { SeasonModel } from '../src/database/models/season.model';
import { PlayerModel } from '../src/database/models/player.model';
import {
  knexSnakeCaseMappers,
  ModelObject,
  PartialModelObject,
} from 'objection';
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
  ...knexSnakeCaseMappers(),
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
  // await downloadRepo();

  try {
    await SeasonModel.query(knex)
      .insert(
        seasons.map<PartialModelObject<SeasonModel>>((season) => {
          return {
            id: season.id,
          };
        }),
      )
      .onConflict('id')
      .ignore();

    await TeamModel.query(knex)
      .insert(
        teams.map<PartialModelObject<TeamModel>>((team) => {
          return {
            id: team.id,
            name: team.name,
            shortName: team.short_name,
          };
        }),
      )
      .onConflict('id')
      .ignore();

    for (const _season of seasons) {
      await importSeason(_season);
    }

    await fs.rmdir(path.join(__dirname, 'tmp'), { recursive: true });

    console.log('all done');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

async function importSeason(_season: Season) {
  console.log('doing ' + _season.name);

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
        awayTeamId: teamSeasons.find(
          (ts) => ts.id === parseInt(_fixture.team_a),
        )!.teamId,
        homeTeamId: teamSeasons.find(
          (ts) => ts.id === parseInt(_fixture.team_h),
        )!.teamId,
        finished: true,
        finishedProvisional: true,
        gameweekId: parseInt(_fixture.event),
        kickoff: _fixture.kickoff_time,
        number: parseInt(_fixture.id),
        started: true,
        seasonId: _season.id,
      };
    }),
  );

  const _playersFixtures = await Promise.all(
    playerSeasons.map(async (playerSeason) => {
      const _player = _players.find(
        ({ code }) => parseInt(code) === playerSeason.playerId,
      )!;

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
  if (season.id < 2018) {
    const json = await fs.readFile(
      path.join(__dirname, 'data', season.id.toString(), 'fixtures.json'),
      'utf-8',
    );

    return JSON.parse(json);
  } else {
    return await parseCsv(
      await fs.readFile(
        path.join(__dirname, 'tmp/data', season.name, 'fixtures.csv'),
        'utf-8',
      ),
    );
  }
}

async function getGameweeks(season: Season) {
  const files = await fs.readdir(
    path.join(__dirname, 'tmp/data', season.name, 'gws'),
  );

  return files
    .map((file) => parseInt(file.match(/gw(\d+)/)?.[1] || ''))
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
  playerSeason: PlayerSeasonModel,
  fixtures: FixtureModel[],
) {
  if (parseInt(_player.code) !== playerSeason.playerId) {
    console.log(_player, playerSeason);
    throw Error('wrong');
  }

  let id = `${_player.first_name}_${_player.second_name}`;

  if (season.id >= 2018) {
    id += `_${_player.id}`;
  }

  const _playerFixtures = await parseCsv(
    await fs.readFile(
      path.join(__dirname, 'tmp/data', season.name, 'players', id, 'gw.csv'),
      'utf-8',
    ),
  );

  return _playerFixtures.map<PartialModelObject<PlayerFixtureModel>>((pf) => {
    const fixture = fixtures.find(
      (f) => f.seasonId === season.id && f.number === Number(pf.fixture),
    );

    if (!fixture) {
      console.log(
        pf,
        fixtures.map(({ number }) => number),
      );
    }

    return {
      playerId: playerSeason.playerId,
      fixtureId: fixture!.id,
      seasonId: season.id,
      assists: numberOrUndefined(pf.assists),
      attemptedPasses: numberOrUndefined(pf.attempted_passes),
      bigChancesCreated: numberOrUndefined(pf.big_chances_created),
      bigChancesMissed: numberOrUndefined(pf.big_chances_missed),
      bonus: numberOrUndefined(pf.bonus),
      bps: numberOrUndefined(pf.bps),
      cleanSheets: numberOrUndefined(pf.clean_sheets),
      clearancesBlocksInterceptions: numberOrUndefined(
        pf.clearances_blocks_interceptions,
      ),
      completedPasses: numberOrUndefined(pf.completed_passes),
      creativity: numberOrUndefined(pf.creativity),
      dribbles: numberOrUndefined(pf.dribbles),
      errorsLeadingToGoal: numberOrUndefined(pf.errors_leading_to_goal),
      errorsLeadingToGoalAttempt: numberOrUndefined(
        pf.errors_leading_to_goal_attempt,
      ),
      fouls: numberOrUndefined(pf.fouls),
      goalsConceded: numberOrUndefined(pf.goals_conceded),
      goalsScored: numberOrUndefined(pf.goals_scored),
      ictIndex: numberOrUndefined(pf.ict_index),
      influence: numberOrUndefined(pf.influence),
      keyPasses: numberOrUndefined(pf.key_passes),
      minutes: numberOrUndefined(pf.minutes),
      offside: numberOrUndefined(pf.offside),
      openPlayCrosses: numberOrUndefined(pf.open_play_crosses),
      opponentTeam: numberOrUndefined(pf.opponent_team),
      ownGoals: numberOrUndefined(pf.own_goals),
      penaltiesConceded: numberOrUndefined(pf.penalties_conceded),
      penaltiesMissed: numberOrUndefined(pf.penalties_missed),
      penaltiesSaved: numberOrUndefined(pf.penalties_saved),
      recoveries: numberOrUndefined(pf.recoveries),
      redCards: numberOrUndefined(pf.red_cards),
      saves: numberOrUndefined(pf.saves),
      selected: numberOrUndefined(pf.selected),
      tackled: numberOrUndefined(pf.tackled),
      tackles: numberOrUndefined(pf.tackles),
      targetMissed: numberOrUndefined(pf.target_missed),
      team_a_score: numberOrUndefined(pf.team_a_score),
      team_h_score: numberOrUndefined(pf.team_h_score),
      threat: numberOrUndefined(pf.threat),
      totalPoints: numberOrUndefined(pf.total_points),
      transfersBalance: numberOrUndefined(pf.transfers_balance),
      transfersIn: numberOrUndefined(pf.transfers_in),
      transfersOut: numberOrUndefined(pf.transfers_out),
      value: numberOrUndefined(pf.value),
      wasHome: pf.was_home === 'True',
      winningGoals: numberOrUndefined(pf.winning_goals),
      yellowCards: numberOrUndefined(pf.yellow_cards),
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

function downloadRepo() {
  return new Promise((resolve, reject) => {
    downloadGitRepo(
      'vaastav/Fantasy-Premier-League',
      path.join(__dirname, 'tmp'),
      (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(undefined);
        }
      },
    );
  });
}

function numberOrUndefined(v: any) {
  return v != null ? Number(v) : undefined;
}

main();
