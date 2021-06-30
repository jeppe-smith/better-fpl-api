import { Test, TestingModule } from '@nestjs/testing';
import { PlayersRepository } from './players.repository';

describe('PlayersService', () => {
  let service: PlayersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayersRepository],
    }).compile();

    service = module.get<PlayersRepository>(PlayersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
