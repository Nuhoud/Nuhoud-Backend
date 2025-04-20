import { Injectable, UnauthorizedException, BadRequestException, ConflictException ,NotFoundException } from '@nestjs/common';
import { LoginUserDto  } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { EmailService } from 'src/email/email.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { WhatsAppService } from 'src/whatsapp/whatsapp.service';
import { SignupDto } from './dto/signup-auth.dto';


@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private otpService: OtpService,
      private emailService: EmailService,
      private whatsappService: WhatsAppService
  ) {}
    
  async signup(signupUser: SignupDto  , isMobile: boolean) {
      const existingUser = await this.usersService.findByIdentifier(signupUser.identifier,isMobile);
      if (existingUser) {
        throw new ConflictException((isMobile ? 'mobile' : 'email')+ ' already exists');
      }
        
      try{
        // Generate OTP
        const { otpCode } = await this.otpService.generateOtp(signupUser.identifier, isMobile);

        if(isMobile){
          await this.whatsappService.sendWhatsAppMessage({phone: signupUser.identifier, message: otpCode.toString()});
        }else{
          await this.emailService.sendOtpEmail(signupUser.identifier, otpCode);
        }

        // Create user with isVerified set to false
        const user = await this.usersService.create(signupUser, false, 'user',isMobile);
        
        return {
          success: true,
          message: 'OTP sent to your ' + (isMobile ? 'mobile' : 'email'),
          identifier: signupUser.identifier,
          isMobile:isMobile
        };
      }catch(error){
        throw new BadRequestException('Failed to send OTP');
      }
  }
  
  async signupAdmin(signupUser: SignupDto, isMobile: boolean) {
    return this.usersService.create(signupUser, true, 'admin', isMobile);
  }

  async login(loginUser: LoginUserDto,isMobile: boolean): Promise<any> {
    
    const user = await this.usersService.findByIdentifier(loginUser.identifier,isMobile)
    
    if (!user) {
      throw new UnauthorizedException('Invalid ' + (isMobile ? 'mobile number' : 'email') + ' or password');
    }

    const isPasswordValid = await bcrypt.compare(loginUser.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid ' + (isMobile ? 'mobile' : 'email') + ' or password');
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      throw new UnauthorizedException('account not verified');
    }

    const payload = { _id: user._id, name:user.name, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return token;
  } 

  async verifyOtp(verifyOtpDto: VerifyOtpDto, isMobile: boolean): Promise<any> {
    const { identifier, otp } = verifyOtpDto;
    
    // Verify OTP
    await this.otpService.verifyOtp(identifier,isMobile, otp);
    
    // Update user to verified
    const user = await this.usersService.findByIdentifier(identifier,isMobile);
    await this.usersService.update(user._id.toString(), { isVerified: true });
    /*     
    const payload = { _id: user._id, name: user.name, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
     */
    return {
      success:true,
      message: 'account verified successfully',
    };
  }
  
  async resendOtp(resendOtpDto: ResendOtpDto, isMobile:boolean): Promise<any> {
    const { identifier } = resendOtpDto;
    
    // Check if user exists
  const user = await this.usersService.findByIdentifier(identifier,isMobile);
  if(!user){
    throw new NotFoundException(`User not found`);
  }

  // Check if user is already verified
  if (user.isVerified) {
    throw new BadRequestException('account is already verified');
    }
    
    // Generate new OTP
    const { otpCode } = await this.otpService.generateOtp(identifier,isMobile);
    
    // Send OTP
    if(isMobile){
      await this.whatsappService.sendWhatsAppMessage({phone: identifier, message: otpCode.toString()});
    }else{
      await this.emailService.sendOtpEmail(identifier, otpCode);
    }
    
    return {
      success: true,
      message: 'OTP sent successfully'+ (isMobile ? 'mobile' : 'email'),
      identifier: resendOtpDto.identifier,
      isMobile:isMobile
    };
  }
}

