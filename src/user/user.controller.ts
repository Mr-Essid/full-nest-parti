import { Controller, Body, Param, Delete, Put, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put()
  editProfile(
    @GetCurrentUserId() sub: string,
    @Body() userData: UpdateUserDto,
  ) {
    return this.userService.editProfile(sub, userData);
  }

  @Delete()
  deleteProfile(@GetCurrentUserId() sub: string) {
    return this.userService.deleteProfile(sub);
  }


  @Get()
  getCurrentUser(@GetCurrentUserId() sub: string) {
    return this.userService.currentUser(sub)
  }


  @Get('/matchs')
  getOwnMatchs(@GetCurrentUserId() sub: string) {
    return this.userService.getOwnMatchs(sub)
  }
}
