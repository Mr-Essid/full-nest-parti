import { Module } from '@nestjs/common';
import { MatchPlayerService } from './match-player.service';
import { MatchPlayerController } from './match-player.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchPlayer, MatchPlayerSchema } from './entities/match-player.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchPlayer.name, schema: MatchPlayerSchema },
    ]),
  ],
  controllers: [MatchPlayerController],
  providers: [MatchPlayerService],
  exports: [MatchPlayerService],
})
export class MatchPlayerModule {}
