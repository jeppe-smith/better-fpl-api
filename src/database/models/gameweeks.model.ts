import { BaseModel } from './base.model';

export class GameweekModel extends BaseModel {
  static tableName = 'gameweeks';

  id!: number;
  seasonId!: number;
}
