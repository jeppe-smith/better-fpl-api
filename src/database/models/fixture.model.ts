import { Model } from 'objection';
import { BaseModel } from './base.model';
import { TeamSeasonModel } from './team-season.model';

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
  awayTeam?: TeamSeasonModel;
  homeTeam?: TeamSeasonModel;

  static relationMappings = {
    awayTeam: {
      relation: Model.BelongsToOneRelation,
      modelClass: TeamSeasonModel,
      join: {
        from: ['fixtures.awayTeamId', 'fixtures.seasonId'],
        to: ['teamSeasons.teamId', 'teamSeasons.seasonId'],
      },
    },
    homeTeam: {
      relation: Model.BelongsToOneRelation,
      modelClass: TeamSeasonModel,
      join: {
        from: ['fixtures.homeTeamId', 'fixtures.seasonId'],
        to: ['teamSeasons.teamId', 'teamSeasons.seasonId'],
      },
    },
  };
}
