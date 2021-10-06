import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { TransferModel } from 'src/database/models/transfer.model';
import { CreateTransferDTO } from './dto/create-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(
    @Inject(TransferModel.name)
    private readonly transferModel: ModelClass<TransferModel>,
  ) {}

  async create(data: CreateTransferDTO[]) {
    await this.transferModel.query().insert(data);
  }

  async findByGameweek(gameweekId: number) {
    return await this.transferModel.query().where({ gameweekId });
  }
}
