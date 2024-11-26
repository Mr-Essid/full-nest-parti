import { Module } from '@nestjs/common';
import { MatchPlayerService } from './match-player.service';
import { MatchPlayerController } from './match-player.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchPlayer, MatchPlayerSchema } from './entities/match-player.entity';
import { Match, MatchSchema } from 'src/match/entities/match.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchPlayer.name, schema: MatchPlayerSchema },
    ]),
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
    ]),
  ],
  controllers: [MatchPlayerController],
  providers: [MatchPlayerService],
  exports: [MatchPlayerService],
})
export class MatchPlayerModule { }
