import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  hashRt: string;

  @Prop({ default: false })
  active: boolean;
  @Prop()
  otp: string;

  @Prop()
  otpExpiry: Date;
  @Prop()
  role: Role;

  @Prop()
  name: string;

  @Prop()
  last_name: string;

  @Prop()
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
