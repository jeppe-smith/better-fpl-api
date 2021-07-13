import { PlayerFixtureModel } from '../models/player-fixture.model';
import { PlayerSeasonModel } from '../models/player-season.model';
import { PlayerModel } from '../models/player.model';

export const modelProviders = [
  PlayerModel,
  PlayerSeasonModel,
  PlayerFixtureModel,
].map((model) => {
  {
    return {
      provide: model.name,
      useValue: model,
    };
  }
});
