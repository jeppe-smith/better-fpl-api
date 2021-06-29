import { BaseModel } from './base.model';

export class PlayerModel extends BaseModel {
  static tableName = 'players';

  id!: number;
  firstName!: string;
  secondName!: string;
  webName!: string;
}
