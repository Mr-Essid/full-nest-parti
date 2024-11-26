import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async editProfile(id: string, userData: UpdateUserDto) {
    return await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .select('-password -hashRt')
      .lean();
  }

  async deleteProfile(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
  async currentUser(id: String) {
    return await this.userModel.findById(id)
  }

  async getOwnMatchs(id: String) {
    return await this.userModel.findById(id)
  }

}
