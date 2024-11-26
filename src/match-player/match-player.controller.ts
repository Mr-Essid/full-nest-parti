import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MatchPlayerService } from './match-player.service';
import { GetCurrentUserId, Public } from 'src/common/decorators';

@Controller('match-player')
export class MatchPlayerController {
  constructor(private readonly matchPlayerService: MatchPlayerService) { }

  @Post('/join/:matchId')
  joinMatch(@Query('team') team, @Param() param, @GetCurrentUserId() userId: string) {
    console.log("match controller executed")
    return this.matchPlayerService.joinMatch(param, userId);
  }

  @Get('/mine')
  findMyMatchPlayer(@GetCurrentUserId() userId: string) {
    console.log("match:mine executed")
    try {
      return this.matchPlayerService.findMyMatchPlayer(userId);
    } catch (e) {
      console.log(e)
    }
  }

  @Public()
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
