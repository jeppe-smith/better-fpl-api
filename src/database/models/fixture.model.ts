import { Model } from 'objection';
import { BaseModel } from './base.model';
import { TeamModel } from './team.model';

export class FixtureModel extends BaseModel {
  static tableName = 'fixtures';

  id!: number;
  awayTeamId!: number;
  finished!: boolean;
  finishedProvisional!: boolean;
  gameweekId!: number;
  homeTeamId!: number;
  kickoff!: Date;
  number!: number;
  seasonId!: number;
  started!: boolean;

  static relationMappings = {
    awayTeam: {
      relation: Model.HasOneRelation,
      modelClass: TeamModel,
      join: {
        from: 'fixtures.away_team_id',
        to: 'teams.id',
      },
    },
    homeTeam: {
      relation: Model.HasOneRelation,
      modelClass: TeamModel,
      join: {
        from: 'fixtures.home_team_id',
        to: 'teams.id',
      },
    },
  };
}
