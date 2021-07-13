import { Model } from 'objection';
import { PlayersRO } from 'src/players/ro/players.ro';
import { BaseModel } from './base.model';
import { PlayerSeasonModel } from './player-season.model';

export class PlayerModel extends BaseModel {
  static tableName = 'players';

  id!: number;
  firstName!: string;
  seasons?: PlayerSeasonModel[];
  secondName!: string;
  webName!: string;

  static get relationMappings() {
    return {
      seasons: {
        relation: Model.HasManyRelation,
        modelClass: PlayerSeasonModel,
        join: {
          from: 'players.id',
          to: 'playerSeasons.playerId',
        },
      },
    };
  }

  toResponseObject(): PlayersRO {
    return {
      id: this.id,
      firstName: this.firstName,
      seasons: this.seasons!.map((playerSeason) => playerSeason.seasonId),
      secondName: this.secondName,
      webName: this.webName,
    };
  }
}
