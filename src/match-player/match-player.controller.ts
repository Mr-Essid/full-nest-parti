import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchPlayerService } from './match-player.service';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('match-player')
export class MatchPlayerController {
  constructor(private readonly matchPlayerService: MatchPlayerService) {}

  @Post('/join/:matchId')
  joinMatch(@Param() param, @GetCurrentUserId() userId: string) {
    return this.matchPlayerService.joinMatch(param, userId);
  }

  @Get('/mine')
  findMyMatchPlayer(@GetCurrentUserId() userId: string) {
    return this.matchPlayerService.findMyMatchPlayer(userId);
  }
  @Get('/all')
  findAllMatchPlayer() {
    return this.matchPlayerService.findAllMatchPlayer();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.matchPlayerService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateMatchPlayerDto: UpdateMatchPlayerDto,
  // ) {
  //   return this.matchPlayerService.update(+id, updateMatchPlayerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.matchPlayerService.remove(+id);
  // }
}
