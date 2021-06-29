import { BaseModel } from './base.model';

export class TeamModel extends BaseModel {
  static tableName = 'teams';

  id!: number;
  name!: string;
  shortName!: string;
}
