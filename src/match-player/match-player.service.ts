import { HttpException, HttpStatus, Injectable, Param, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MatchPlayer } from './entities/match-player.entity';
import { Model } from 'mongoose';
import { Match } from 'src/match/entities/match.entity';

@Injectable()
export class MatchPlayerService {
  constructor(
    @InjectModel(MatchPlayer.name) private matchPLayerModel: Model<MatchPlayer>,
    @InjectModel(Match.name) private matchModel: Model<Match>,
  ) { }

  async joinMatch(param, userId: string, isAccepted: boolean = false) {
    const playerAlreadyJoined = await this.matchPLayerModel.findOne({
      matchId: param.matchId,
      userId,
    });
    if (playerAlreadyJoined) {
      throw new HttpException(
        'You have already joined this match',
        HttpStatus.BAD_REQUEST,
      );
    }

    const numberOfMatchId = await this.matchPLayerModel.countDocuments()

    if (numberOfMatchId == 10)
      throw new HttpException("match full of plyers", HttpStatus.BAD_REQUEST)


    const match = await this.matchPLayerModel.create({
      matchId: param.matchId,
      userId,
      isAccepted,
    });


    await this.matchModel.findByIdAndUpdate(param.matchId, {
      $push: { playersOfMatch: match._id }
    })

    return match;


  }

  async findMyMatchPlayer(userId: string) {
    const matchPlayer = await this.matchPLayerModel
      .find({})
      .populate('matchId')
      .populate({ path: 'userId', select: 'email name last_name phone' })
      .exec();

    const myMatchPlayer = matchPlayer.filter(
      (m) => m.matchId.userId.toString() === userId,
    );
    return myMatchPlayer;
  }
  async findAllMatchPlayer() {
    const matchPlayer = await this.matchPLayerModel
      .find({})

      .populate('matchId')
      .populate({ path: 'userId', select: 'email name last_name phone' })
      .exec();



    return matchPlayer;
  }
  // findOne(id: number) {
  //   return `This action returns a #${id} matchPlayer`;
  // }

  // update(id: number, updateMatchPlayerDto: UpdateMatchPlayerDto) {
  //   return `This action updates a #${id} matchPlayer`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} matchPlayer`;
  // }
}
