import { Module } from '@nestjs/common';
import { TerrainService } from './terrain.service';
import { TerrainController } from './terrain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Terrain, TerrainSchema } from './entities/terrain.entity';
import { Match, MatchSchema } from 'src/match/entities/match.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Terrain.name, schema: TerrainSchema }]),
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
  ],
  controllers: [TerrainController],
  providers: [TerrainService],
})
export class TerrainModule { }
