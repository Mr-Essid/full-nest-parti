import {
  HttpException,
  HttpStatus,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { SignupDto } from './dto/signup.dto';
import { Tokens } from './types';
import { MailerService } from 'src/mailer/mailer.service';
import { TokenService } from './token.service';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService,
  ) { }

  async otpSend(data): Promise<boolean> {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const otp = authenticator.generate(process.env.OTP_SECRET);
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // Save OTP and expiry to user document
    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // Send OTP to user’s email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    return true;
  }

  async otpVerify(email: string, code: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry) {
      throw new HttpException(
        'Invalid or expired OTP',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Check OTP and expiry time
    if (user.otp !== code || user.otpExpiry < new Date()) {
      throw new HttpException(
        'Invalid or expired OTP',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Activate account and clear OTP fields
    user.active = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return true;
  }
  async login(loginData: LoginDto): Promise<Tokens> {
    const userExist = await this.userModel.findOne({ email: loginData.email });
    if (!userExist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const passwordMatch = await argon2.verify(
      userExist.password,
      loginData.password,
    );
    if (!passwordMatch) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    const tokens = await this.tokenService.generateTokens(
      userExist._id.toString(),
      userExist.email,
      userExist.role,
    );
    await this.tokenService.updateRtHash(
      userExist._id.toString(),
      tokens.refresh_token,
    );
    return tokens;
  }

  async logout(userId: string) {
    await this.tokenService.clearRtHash(userId);
    return true;
  }

  async signup(signupData: SignupDto): Promise<Tokens> {
    const userExist = await this.userModel.findOne({ email: signupData.email });
    if (userExist) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await argon2.hash(signupData.password);
    const newUser = new this.userModel({
      ...signupData,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const tokens = await this.tokenService.generateTokens(
      savedUser._id.toString(),
      savedUser.email,
      savedUser.role,
    );

    await this.tokenService.updateRtHash(
      savedUser._id.toString(),
      tokens.refresh_token,
    );

    try {
      await this.mailerService.sendMail({
        to: savedUser.email,
        subject: 'Account Created',
        text: 'Your account has been created successfully',
      });
      console.log("No Mail Errors")
    } catch (e) {
      console.log(e)
      console.log("Problem in mail sending")
    }

    return tokens;
  }

  async refresh(userId: string, rt: string): Promise<Tokens> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user || !user.hashRt) {
      throw new ForbiddenException('Access Denied');
    }

    await this.tokenService.verifyRefreshToken(user.hashRt, rt);

    const tokens = await this.tokenService.generateTokens(
      user._id.toString(),
      user.email,
      user.role,
    );
    await this.tokenService.updateRtHash(
      user._id.toString(),
      tokens.refresh_token,
    );

    return tokens;
  }
}
