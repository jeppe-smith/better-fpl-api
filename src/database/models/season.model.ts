import { BaseModel } from './base.model';

export class SeasonModel extends BaseModel {
  static tableName = 'seasons';

  id!: number;
}
