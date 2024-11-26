import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTerrainDto } from './dto/create-terrain.dto';
import { UpdateTerrainDto } from './dto/update-terrain.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Terrain } from './entities/terrain.entity';
import { Model } from 'mongoose';
import { Match } from 'src/match/entities/match.entity';
import { ModuleLinker } from 'vm';
import path from 'path';

@Injectable()
export class TerrainService {
  constructor(
    @InjectModel(Terrain.name) private terrainModel: Model<Terrain>,
    @InjectModel(Match.name) private matchModel: Model<Match>
  ) { }

  async create(createTerrainDto: CreateTerrainDto, user) {
    if (user.role !== 'manager') {
      throw new HttpException(
        'You are not allowed to create a terrain , you must be a manager',
        HttpStatus.FORBIDDEN,
      );
    }
    const existingTerrain = await this.terrainModel.findOne({
      managerId: user.sub,
    });
    if (existingTerrain) {
      throw new HttpException(
        'You are not allowed to create a terrain , you already have one',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.terrainModel.create({
      ...createTerrainDto,
      managerId: user.sub,
    });
  }


  async getStatistics(user) {

    if (user.role !== 'manager') {
      throw new HttpException(
        'Not Allowed to see statistics you dont have :)',
        HttpStatus.FORBIDDEN,
      );
    }

    console.log(user)
    const terrain = await this.terrainModel.findOne({ managerId: user.sub })

    if (terrain == null) {
      return {
        'countMatchs': 0,
        'amount': 0,
      }
    }

    const allMatchesCount = await this.matchModel.countDocuments({ terrainId: terrain.id })

    return {
      'countMatchs': allMatchesCount,
      'amout': allMatchesCount * terrain.price,
    }

  }

  async findAll() {
    return await this.terrainModel.find();
  }

  async getMyTerrain(managerId: string) {
    return await this.terrainModel.findOne({ managerId }).populate(
      {
        path: "matchsIn",
        populate: {
          path: "playersOfMatch"
        }
      },
    );
  }


  async getMatchsOfTerrain(terrainId: string) {
    return await this.terrainModel.findById(terrainId.trim(), { matchsIn: true }).populate({ path: "matchsIn" }).exec();
  }

  // update(id: number, updateTerrainDto: UpdateTerrainDto) {
  //   return `This action updates a #${id} terrain`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} terrain`;
  // }
}
