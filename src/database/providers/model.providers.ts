import { PlayerFixtureModel } from '../models/player-fixture.model';
import { PlayerSeasonModel } from '../models/player-season.model';

export const modelProviders = [PlayerSeasonModel, PlayerFixtureModel].map(
  (model) => {
    {
      return {
        provide: model.name,
        useValue: model,
      };
    }
  },
);
