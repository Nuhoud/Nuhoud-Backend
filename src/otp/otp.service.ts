import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './entities/otp.entity';
import * as otplib from 'otplib';

@Injectable()
export class OtpService {
  private readonly otpExpiryMinutes: number;
  private readonly maxAttempts: number;

  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
  ) {
    this.otpExpiryMinutes = 5;
    this.maxAttempts = 3;
  }

  //Generate a new OTP for the given email
  async generateOtp(identifier: string, isMobile: boolean): Promise<{ otpCode: string }> {
    
    const otpCode = otplib.authenticator.generateSecret(5).substring(0, 5);
    
    // Set expiry time (5 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.otpExpiryMinutes);

    const existingOtp = await this.otpModel.findOne({ [isMobile ? 'mobile' : 'email']: identifier }).exec();

    if (existingOtp) {
      // Update the existing OTP
      existingOtp.code = otpCode;
      existingOtp.expiresAt = expiresAt;
      existingOtp.attempts = 0;
      await existingOtp.save();
    } else {
      // Create a new OTP record
      const newOtp = new this.otpModel({
        [isMobile ? 'mobile' : 'email']: identifier,
        code: otpCode,
        expiresAt,
        attempts: 0
      });
      await newOtp.save();
    }
    return { otpCode };
  }


  //Verify an OTP for the given email
  async verifyOtp(identifier: string, isMobile: boolean = false, code: string): Promise<boolean> {
    const otp = await this.otpModel.findOne({ [isMobile ? 'mobile' : 'email']: identifier }).exec();

    if (!otp) {
      throw new NotFoundException('OTP not found for this identifier');
    }

    if (new Date() > otp.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }



    if (otp.attempts > this.maxAttempts) {
      throw new BadRequestException(`Maximum verification attempts (${this.maxAttempts}) exceeded`);
    }
    otp.attempts += 1;
    await otp.save();

    if (otp.code !== code) {
      const remainingAttempts = this.maxAttempts - otp.attempts;
      throw new BadRequestException(`Invalid OTP. ${remainingAttempts} attempts remaining`);
    }

    await this.otpModel.deleteOne({ [isMobile ? 'mobile' : 'email']: identifier });

    return true;
  }
}
