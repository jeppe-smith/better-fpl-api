import { Model } from 'objection';
import { BaseModel } from './base.model';
import { FixtureModel } from './fixture.model';
import { PlayerModel } from './player.model';

export class PlayerFixtureModel extends BaseModel {
  static tableName = 'player_fixtures';

  static get idColumn() {
    return ['player_id', 'fixture_id'];
  }

  playerId!: number;
  fixtureId!: number;
  assists!: number;
  attemptedPasses!: number;
  bigChancesCreated!: number;
  bigChancesMissed!: number;
  bonus!: number;
  bps!: number;
  cleanSheets!: number;
  clearancesBlocksInterceptions!: number;
  completedPasses!: number;
  creativity!: number;
  dribbles!: number;
  errorsLeadingToGoal!: number;
  errorsLeadingToGoalAttempt!: number;
  fouls!: number;
  goalsConceded!: number;
  goalsScored!: number;
  ictIndex!: number;
  influence!: number;
  keyPasses!: number;
  loanedIn!: number;
  loanedOut!: number;
  minutes!: number;
  offside!: number;
  openPlayCrosses!: number;
  opponentTeam!: number;
  ownGoals!: number;
  penaltiesConceded!: number;
  penaltiesMissed!: number;
  penaltiesSaved!: number;
  recoveries!: number;
  redCards!: number;
  round!: number;
  saves!: number;
  selected!: number;
  tackled!: number;
  tackles!: number;
  targetMissed!: number;
  teamAScore!: number;
  teamHScore!: number;
  threat!: number;
  totalPoints!: number;
  transfersBalance!: number;
  transfersIn!: number;
  transfersOut!: number;
  value!: number;
  wasHome!: boolean;
  winningGoals!: number;
  yellowCards!: number;
  createdAt!: Date;
  updatedAt!: Date;

  static relationMappings = {
    player: {
      relation: Model.HasOneRelation,
      modelClass: PlayerModel,
      join: {
        from: 'player_fixtures.player_id',
        to: 'players.id',
      },
    },
    fixture: {
      relation: Model.HasOneRelation,
      modelClass: FixtureModel,
      join: {
        from: 'player_fixtures.fixture_id',
        to: 'fixtures.id',
      },
    },
  };
}
