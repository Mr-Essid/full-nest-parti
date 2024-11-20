import { Module } from '@nestjs/common';
import { TerrainService } from './terrain.service';
import { TerrainController } from './terrain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Terrain, TerrainSchema } from './entities/terrain.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Terrain.name, schema: TerrainSchema }]),
  ],
  controllers: [TerrainController],
  providers: [TerrainService],
})
export class TerrainModule {}
