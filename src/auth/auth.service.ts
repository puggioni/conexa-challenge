import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/schema/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login-auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { plainToHash, comparePlainToHash } from './utils/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, ...userData } = registerDto;
    const existingUser = await this.userModel.findOne({
      email: userData.email,
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const parsedUser = {
      ...userData,
      password: await plainToHash(password),
    };
    const createdUser = new this.userModel(parsedUser);
    return createdUser.save();
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await comparePlainToHash(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const userFlat = user.toObject();
    delete userFlat.password;

    const token = await this.jwtService.signAsync({
      id: userFlat._id,
      role: userFlat.role,
      full_name: userFlat.full_name,
      email: userFlat.email,
    });

    const data = {
      user: userFlat,
      token,
    };

    return data;
  }
}
