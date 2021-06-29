import { BaseModel } from './base.model';

export class PlayerSeasonModel extends BaseModel {
  static tableName = 'player_seasons';

  static get idColumn() {
    return ['player_id', 'season_id'];
  }

  playerId!: number;
  seasonId!: number;
  id!: number;
}
