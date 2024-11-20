import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTerrainDto } from './dto/create-terrain.dto';
import { UpdateTerrainDto } from './dto/update-terrain.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Terrain } from './entities/terrain.entity';
import { Model } from 'mongoose';

@Injectable()
export class TerrainService {
  constructor(
    @InjectModel(Terrain.name) private terrainModel: Model<Terrain>,
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

  async findAll() {
    return await this.terrainModel.find();
  }

  async getMyTerrain(managerId: string) {
    return await this.terrainModel.findOne({ managerId })
  }

  // update(id: number, updateTerrainDto: UpdateTerrainDto) {
  //   return `This action updates a #${id} terrain`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} terrain`;
  // }
}
