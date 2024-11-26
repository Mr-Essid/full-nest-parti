import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './entities/match.entity';
import { MatchPlayerModule } from 'src/match-player/match-player.module';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { Terrain, TerrainSchema } from 'src/terrain/entities/terrain.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Terrain.name, schema: TerrainSchema }]),
    MatchPlayerModule,
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule { }
