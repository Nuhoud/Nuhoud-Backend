import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create a nodemailer transporter using Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }


  // Send an OTP verification email
  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const appName = 'Nuhoud';
    try{
      const mailOptions = {
        from: `${appName} <${process.env.EMAIL_USER}>`,
        to,
        subject: `${appName} - Email Verification Code`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">${appName} Email Verification</h2>
            <p style="color: #555; font-size: 16px;">Thank you for registering with ${appName}. Please use the following verification code to complete your registration:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #555; font-size: 14px;">This code will expire in 5 minutes.</p>
            <p style="color: #555; font-size: 14px;">If you did not request this verification, please ignore this email.</p>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
              &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
            </div>
          </div>
        `,
      };
      await this.transporter.sendMail(mailOptions);
    }catch(error){
      throw new HttpException('Failed to send OPT via Email', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
