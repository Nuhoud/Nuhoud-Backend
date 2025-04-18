import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { LoginUserDto  } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { resultUserDto } from './dto/result-atuh.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { OtpService } from 'src/otp/otp.service';
import { EmailService } from 'src/email/email.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private otpService: OtpService,
      private emailService: EmailService
  ) {}
    
  async signup(signupUser: CreateUserDto) {
      // Check if user with email already exists
      const existingUser = await this.usersService.findByEmail(signupUser.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
      try{
        // Create user with isVerified set to false
        const user = await this.usersService.create(signupUser, false, 'user');
        // Generate OTP
        const { otpCode } = await this.otpService.generateOtp(user.email);
        // Send OTP email
        await this.emailService.sendOtpEmail(user.email, otpCode);
      }catch(error){
        throw new BadRequestException('Failed to send OTP');
      }
  }
  
  async signupAdmin(signupUser: CreateUserDto) {
    return this.usersService.create(signupUser, true, 'admin');
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
    
    // Check if user is verified
    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified. Please verify your email before logging in.');
    }

    const payload = { _id: user._id, name:user.name, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return token;
  } 

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
    const { email, otp } = verifyOtpDto;
    
    // Verify OTP
    await this.otpService.verifyOtp(email, otp);
    
    // Update user to verified
    const user = await this.usersService.findByEmail(email);
    await this.usersService.update(user._id.toString(), { isVerified: true });
    
    // Generate token for automatic login after verification
    const payload = { _id: user._id, name: user.name, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    
    return {
      message: 'Email verified successfully',
      token
    };
  }
  
  async resendOtp(resendOtpDto: ResendOtpDto): Promise<any> {
    const { email } = resendOtpDto;
    
    // Check if user exists
    const user = await this.usersService.findByEmail(email);
    
    // Check if user is already verified
    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }
    
    // Generate new OTP
    const { otpCode } = await this.otpService.generateOtp(email);
    
    // Send OTP email
    await this.emailService.sendOtpEmail(email, otpCode);
    
    return {
      message: 'OTP sent successfully'
    };
  }
}

