import { PlayerFixtureModel } from '../models/player-fixture.model';
import { PlayerSeasonModel } from '../models/player-season.model';
import { PlayerModel } from '../models/player.model';
import { TransferModel } from '../models/transfer.model';

export const modelProviders = [
  PlayerModel,
  PlayerSeasonModel,
  PlayerFixtureModel,
  TransferModel,
].map((model) => {
  {
    return {
      provide: model.name,
      useValue: model,
    };
  }
});
