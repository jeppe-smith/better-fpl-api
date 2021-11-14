import { BaseModel } from './base.model';

export class TransferModel extends BaseModel {
  static tableName = 'transfers';

  id!: number;
  chip!: 'freehit' | 'wildcard' | null;
  gameweekId!: number;
  playerIn!: number;
  playerOut!: number;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['chip', 'gameweek_id', 'player_in', 'player_out'],
      properties: {
        chip: { enum: ['freehit', 'wildcard', null] },
        entry_id: { type: 'string' },
        gameweek_id: { type: 'integer' },
        player_in: { type: 'integer' },
        player_out: { type: 'integer' },
      },
    };
  }
}
