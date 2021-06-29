import { Model } from 'objection';
import { BaseModel } from './base.model';
import { TeamModel } from './team.model';

export class TeamSeasonModel extends BaseModel {
  static tableName = 'team_seasons';

  id!: number;
  seasonId!: number;
  teamId!: number;

  static relationMappings = {
    team: {
      relation: Model.BelongsToOneRelation,
      modelClass: TeamModel,
      join: {
        from: 'team_seasons.team_id',
        to: 'teams.id',
      },
    },
  };
}
