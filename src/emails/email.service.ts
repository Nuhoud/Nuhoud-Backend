import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import * as dotenv from 'dotenv';
dotenv.config();

export interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

export interface EmailResponse {
  ok: boolean;
  message: string;
}


interface EmailService {
  sendEmail(data: { to: string; subject: string; html: string }): Observable<EmailResponse>;
}

@Injectable()
export class EmailsService implements OnModuleInit {
  private service: EmailService;

  constructor(@Inject('EMAILS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<EmailService>('EmailService');
  }

  sendOTP(to: string, otp: string) {
    const appName = 'Nuhoud';

    const html:string =
    `
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
    `;

    const subject:string = `${appName} - Email Verification Code`;
    
    return this.service.sendEmail({ to, subject, html});
  }
}
