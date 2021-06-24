import { Model } from 'objection';
import { CreateDTO } from './create-dto.type';

export type UpdateDTO<T extends Model> = CreateDTO<T> & { id: number };
