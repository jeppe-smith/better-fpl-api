import { Model } from 'objection';
import { BaseModel } from './base.model';
import { TeamModel } from './team.model';

export class TeamSeasonModel extends BaseModel {
  static tableName = 'teamSeasons';

  id!: number;
  seasonId!: number;
  teamId!: number;
  team?: TeamModel;

  static relationMappings = {
    team: {
      relation: Model.BelongsToOneRelation,
      modelClass: TeamModel,
      join: {
        from: 'teamSeasons.teamId',
        to: 'teams.id',
      },
    },
  };
}
