import { Model } from 'objection';
import { PlayersRO } from 'src/players/ro/players.ro';
import { BaseModel } from './base.model';
import { PlayerFixtureModel } from './player-fixture.model';
import { PlayerModel } from './player.model';

export class PlayerSeasonModel extends BaseModel {
  fixtures?: PlayerFixtureModel[];
  id!: number;
  player?: PlayerModel;
  playerId!: number;
  seasonId!: number;

  static get tableName() {
    return 'playerSeasons';
  }

  static get idColumn() {
    return ['playerId', 'seasonId'];
  }

  static get relationMappings() {
    return {
      player: {
        relation: Model.BelongsToOneRelation,
        modelClass: PlayerModel,
        join: {
          from: 'playerSeasons.playerId',
          to: 'players.id',
        },
      },
      fixtures: {
        relation: Model.HasManyRelation,
        modelClass: PlayerFixtureModel,
        join: {
          from: ['playerSeasons.playerId', 'playerSeasons.seasonId'],
          to: ['playerFixtures.playerId', 'playerFixtures.seasonId'],
        },
      },
    };
  }

  toReponseObject(): PlayersRO {
    return {
      code: this.playerId,
      id: this.id,
      season: this.seasonId,
      firstName: this.player!.firstName,
      secondName: this.player!.secondName,
      webName: this.player!.webName,
    };
  }
}
