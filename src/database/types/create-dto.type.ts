import { Model, PartialModelObject } from 'objection';
import { BaseModel } from '../models/base.model';

export type CreateDTO<T extends Model> = Omit<
  PartialModelObject<T>,
  keyof BaseModel
>;
