import { BaseModel } from './base.model';

export class PlayerSeasonModel extends BaseModel {
  static tableName = 'player_seasons'

  playerCode!: number
  season!: number
  gameweeks!: string
}
