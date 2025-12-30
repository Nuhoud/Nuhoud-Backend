import { Injectable, UnauthorizedException, BadRequestException, ConflictException ,NotFoundException, ForbiddenException } from '@nestjs/common';
import { LoginUserDto  } from './dto/login-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { EmailsService } from 'src/emails/email.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { WhatsappService } from 'src/whatsapp-grpc/whatsapp.service';
import { SignupDto, SignupEmployerDto } from './dto/signup-auth.dto';
import {ResetPasswordDto} from './dto/resetPassword-auth.dto'
import { lastValueFrom } from 'rxjs';


@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private otpService: OtpService,
      private emailService: EmailsService,
      private whatsappService: WhatsappService
  ) {}
    
  async signup(signupUser: SignupDto  , isMobile: boolean) {
    try{
      const existingUser = await this.usersService.findByIdentifier(signupUser.identifier,isMobile);
      if (existingUser) {
        throw new ConflictException((isMobile ? 'mobile' : 'email')+ ' already exists');
      }
      // Generate OTP
      const { otpCode } = await this.otpService.generateOtp(signupUser.identifier, isMobile);

      if(isMobile){
        console.log('sendWhatsAppMessage');
        this.whatsappService.sendMessage(signupUser.identifier, this.getOtpMessageTemplate(signupUser.name,otpCode.toString(),"SignUP",5))
        .subscribe({
          next: (result) => {
            console.log('WhatsApp message sent successfully:', result);
          },
          error: (err) => {
            console.error('Error sending WhatsApp message:', err);
          },
          complete: () => {
            console.log('WhatsApp message sending completed');
          }
        });
      }else{
        //await lastValueFrom(this.emailService.sendOTP(signupUser.identifier, otpCode))
        
        this.emailService.sendOTP(signupUser.identifier, otpCode)
        .subscribe({
          next: (result) => {
            console.log('Email message sent successfully:', result);
          },
          error: (err) => {
            console.error('Error sending Email message:', err);
          },
          complete: () => {
            console.log('Email message sending completed');
          }
        });
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
      throw error;
    }
  }
  
  async signupAdmin(signupUser: SignupDto, isMobile: boolean) {
    return this.usersService.create(signupUser, true, 'admin', isMobile);
  }

  async signupEmployer(signupEmployerUser: SignupEmployerDto) {
    return this.usersService.createEmployer(signupEmployerUser);
  }

  async login(loginUser: LoginUserDto,isMobile: boolean) {
    try{
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
        throw new ForbiddenException('Account not verified');
      }
  
      const payload: any = { 
        _id: user._id, 
        name: user.name, 
        identifier: isMobile ? user.mobile : user.email,
        role: user.role 
      };
      if (user.role === 'employer' && user.company?.name) {
        payload.company = user.company.name;
      }
      
      const token = await this.jwtService.signAsync(payload);
      return {
        token,
        isFirstTime: user.isFirstTime
      };
    }catch(error){
      throw error;
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto, isMobile: boolean): Promise<any> {
    const { identifier, otp } = verifyOtpDto;
    
    // Verify OTP
    await this.otpService.verifyOtp(identifier,isMobile, otp);
    
    // Update user to verified
    const user = await this.usersService.findByIdentifier(identifier,isMobile);
    await this.usersService.update(user._id.toString(), { isVerified: true });
        
    const payload: any = { 
      _id: user._id, 
      name: user.name, 
      identifier: isMobile ? user.mobile : user.email,
      role: user.role 
    };
    if (user.role === 'employer' && user.company?.name) {
      payload.company = user.company.name;
    }

    const token = await this.jwtService.signAsync(payload);
    
    return {
      success:true,
      message: 'account verified successfully',
      identifier: identifier,
      isMobile: isMobile,
      token: token
    };
  }
  
  async resendOtp(resendOtpDto: ResendOtpDto, isMobile:boolean): Promise<any> {
    const { identifier } = resendOtpDto;
    
    // Check if user exists
    const user = await this.usersService.findByIdentifier(identifier,isMobile);
    if(!user){
      throw new NotFoundException(`User not found`);
    }
    
    // Generate new OTP
    const { otpCode } = await this.otpService.generateOtp(identifier,isMobile);
    
    // Send OTP
    if(isMobile){
      this.whatsappService.sendMessage(identifier, this.getOtpMessageTemplate(user.name,otpCode.toString(),"reset Password",5))
      .subscribe({
        next: (result) => {
          console.log('WhatsApp message sent successfully:', result);
        },
        error: (err) => {
          console.error('Error sending WhatsApp message:', err);
        },
        complete: () => {
          console.log('WhatsApp message sending completed');
        }
      });
    }else{
      await this.emailService.sendOTP(identifier, otpCode);
    }
    
    return {
      success: true,
      message: 'OTP sent successfully'+ (isMobile ? 'mobile' : 'email'),
      identifier: resendOtpDto.identifier,
      isMobile:isMobile
    };
  }

  
  async requestPasswordReset(identifier: string, isMobile: boolean): Promise<any> {
    // Check if user exists
    //console.log(identifier);
    const user = await this.usersService.findByIdentifier(identifier, isMobile);
    if (!user) {
      throw new NotFoundException(`User with this ${isMobile ? 'mobile number' : 'email'} not found`);
    }
  
    // Generate OTP
    const { otpCode } = await this.otpService.generateOtp(identifier, isMobile);
  
    // Send OTP via email or WhatsApp
    if (isMobile) {
      this.whatsappService.sendMessage(identifier, this.getOtpMessageTemplate(user.name,otpCode.toString(),"reset Password",5))
      .subscribe({
        next: (result) => {
          console.log('WhatsApp message sent successfully:', result);
        },
        error: (err) => {
          console.error('Error sending WhatsApp message:', err);
        },
        complete: () => {
          console.log('WhatsApp message sending completed');
        }
      });
    } else {
      const result = await this.emailService.sendOTP(
        identifier, 
        otpCode
      );
      console.log(result);
    }
  
    return {
      success: true,
      message: `Password reset OTP sent to your ${isMobile ? 'mobile' : 'email'}`,
      identifier: identifier,
      isMobile: isMobile
    };
  }
  
  async resetPassword(resetPasswordDto: ResetPasswordDto, userId: string): Promise<any> {
      const { newPassword } = resetPasswordDto;
      
      // Find user and update password 
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException(`User with this ID not found`);
      }
      
      // Update user's password
      await this.usersService.update(user._id.toString(), { password: newPassword });
      
      return {
        success: true,
        message: 'Password has been reset successfully'
      };
  }



  getOtpMessageTemplate(user: string, otpCode: string, purpose: string, otpExpiryMinutes: number): string {
    return `📲 رمز التحقق لمرة واحدة (OTP)
مرحبًا ${user},

رمزك لـ ${purpose} هو: ${otpCode}

⚠️ لا تشارك هذا الرمز مع أي شخص. مدة الصلاحية ${otpExpiryMinutes} دقيقة.
للمساعدة: contact@nuhoud.com`;
  }
}

