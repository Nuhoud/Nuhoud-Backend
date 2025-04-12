import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto  } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { resultUserDto } from './dto/result-atuh.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService
  ) {}
    
  async signup(signupUser: CreateUserDto) {
      return this.usersService.create(signupUser);
  }

  async login(loginUser: LoginUserDto): Promise<any> {
    const user = await this.usersService.findByEmail(loginUser.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginUser.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { _id: user._id, name:user.name, email: user.email, userType: user.userType };
    const token = await this.jwtService.signAsync(payload);
    return token;
  } 

  
}

