import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseArrayPipe,
  Post,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ValidationError } from 'objection';
import { CreateTransferDTO } from './dto/create-transfer.dto';
import { TransfersService } from './transfers.service';
import { uniqBy, maxBy } from 'lodash';
import { TransferModel } from 'src/database/models/transfer.model';

interface NetTransfer {
  playerId: number;
  transfers: number;
}

interface NetTransferObject {
  [playerId: string]: number;
}

@Controller('transfers')
export class TransfersController {
  constructor(
    private readonly transfersService: TransfersService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async createTransfers(
    @Body(new ParseArrayPipe({ items: CreateTransferDTO }))
    transfers: CreateTransferDTO[],
  ) {
    try {
      await this.transfersService.create(transfers);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException({ errors: error.data });
      }

      throw new InternalServerErrorException(error);
    }
  }

  @Get('/:gameweekId')
  async getTransfersInGameweek(@Param('gameweekId') gameweekId: number) {
    const transfers = await this.transfersService.findByGameweek(gameweekId);

    const sampleSize = uniqBy(transfers, 'entryId').length;
    const normalTransfers = transfers.filter(
      (transfer) => transfer.chip === null,
    );
    const freehitTransfers = transfers.filter(
      (transfer) => transfer.chip === 'freehit',
    );
    const wildcardTransfers = transfers.filter(
      (transfer) => transfer.chip === 'wildcard',
    );

    return {
      sampleSize,
      gameweek: gameweekId,
      updated: maxBy(transfers, 'updatedAt')?.updatedAt || null,
      normalTransfers: this.getNetTransfers(normalTransfers),
      freehitTransfers: this.getNetTransfers(freehitTransfers),
      wildcardTransfers: this.getNetTransfers(wildcardTransfers),
    };
  }

  private getNetTransfers(transfers: TransferModel[]) {
    const netTransfersObject = transfers.reduce<NetTransferObject>(
      (object, transfer) => {
        if (object[transfer.playerIn] === undefined) {
          object[transfer.playerIn] = 1;
        } else {
          object[transfer.playerIn] = object[transfer.playerIn] + 1;
        }

        if (object[transfer.playerOut] === undefined) {
          object[transfer.playerOut] = -1;
        } else {
          object[transfer.playerOut] = object[transfer.playerOut] - 1;
        }

        return object;
      },
      {},
    );

    return Object.keys(netTransfersObject).map((playerId) => {
      return {
        playerId: parseInt(playerId),
        transfers: netTransfersObject[playerId],
      };
    });
  }
}
