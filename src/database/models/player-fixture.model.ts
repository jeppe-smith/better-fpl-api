import { Model } from 'objection';
import { PlayerFixturesRO } from 'src/players/ro/player-fixtures.ro';
import { BaseModel } from './base.model';
import { FixtureModel } from './fixture.model';

export class PlayerFixtureModel extends BaseModel {
  static tableName = 'playerFixtures';

  static get idColumn() {
    return ['playerId', 'fixtureId'];
  }

  playerId!: number;
  fixtureId!: number;
  seasonId!: number;
  assists!: number;
  attemptedPasses!: number;
  bigChancesCreated!: number;
  bigChancesMissed!: number;
  bonus!: number;
  bps!: number;
  chanceOfPlaying!: number;
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
  status!: string | null;
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
  fixture?: FixtureModel;

  static relationMappings = {
    fixture: {
      relation: Model.BelongsToOneRelation,
      modelClass: FixtureModel,
      join: {
        from: 'playerFixtures.fixtureId',
        to: 'fixtures.id',
      },
    },
  };

  toResponseObject(): PlayerFixturesRO {
    return {
      assists: this.assists,
      attemptedPasses: this.attemptedPasses,
      awayTeam: this.fixture!.awayTeam!.team!.shortName,
      bigChancesCreated: this.bigChancesCreated,
      bigChancesMissed: this.bigChancesMissed,
      bonus: this.bonus,
      bps: this.bps,
      cleanSheets: this.cleanSheets,
      clearancesBlocksInterceptions: this.clearancesBlocksInterceptions,
      completedPasses: this.completedPasses,
      creativity: this.creativity,
      dribbles: this.dribbles,
      errorsLeadingToGoal: this.errorsLeadingToGoal,
      errorsLeadingToGoalAttempt: this.errorsLeadingToGoalAttempt,
      fixture: this.fixtureId,
      fouls: this.fouls,
      gameweek: this.fixture!.gameweekId,
      goalsConceded: this.goalsConceded,
      goalsScored: this.goalsScored,
      homeTeam: this.fixture!.homeTeam!.team!.shortName,
      ictIndex: this.ictIndex,
      influence: this.influence,
      keyPasses: this.keyPasses,
      kickoff: this.fixture!.kickoff,
      minutes: this.minutes,
      offside: this.offside,
      openPlayCrosses: this.openPlayCrosses,
      opponentTeam: this.opponentTeam,
      ownGoals: this.ownGoals,
      penaltiesConceded: this.penaltiesConceded,
      penaltiesMissed: this.penaltiesMissed,
      penaltiesSaved: this.penaltiesSaved,
      recoveries: this.recoveries,
      redCards: this.redCards,
      round: this.round,
      saves: this.saves,
      season: this.seasonId,
      selected: this.selected,
      tackled: this.tackled,
      tackles: this.tackles,
      targetMissed: this.targetMissed,
      teamAScore: this.teamAScore,
      teamHScore: this.teamHScore,
      threat: this.threat,
      totalPoints: this.totalPoints,
      transfersBalance: this.transfersBalance,
      transfersIn: this.transfersIn,
      transfersOut: this.transfersOut,
      value: this.value,
      wasHome: this.wasHome,
      winningGoals: this.winningGoals,
      yellowCards: this.yellowCards,
    };
  }
}
