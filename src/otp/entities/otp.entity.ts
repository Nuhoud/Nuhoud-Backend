import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {

  @ApiProperty({
    description: 'The unique identifier for the OTP',
    example: '507f1f77bcf86cd799439011'
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'The email associated with this OTP',
    example: 'test@test.com',
    uniqueItems: true
  })
  @Prop({ unique: true ,sparse: true,type: String })
  email: string;

  @ApiProperty({
    description: 'The mobile associated with this OTP',
    example: '963936961320',
    uniqueItems: true
  })
  @Prop({ unique: true ,sparse: true,type: String })
  mobile?: string;

  @ApiProperty({
    description: 'The OTP code',
    example: '123456',
    required: true
  })
  @Prop({ required: true, type: String })
  code: string;

  @ApiProperty({
    description: 'The expiry date of the OTP',
    required: true
  })
  @Prop({ required: true, type: Date })
  expiresAt: Date;

  @ApiProperty({
    description: 'The number of verification attempts made',
    example: 0,
    default: 0
  })
  @Prop({ default: 0, type: Number })
  attempts: number;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
