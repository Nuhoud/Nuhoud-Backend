import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

  @ApiProperty({
    description: 'The unique identifier for the user',
    example: '507f1f77bcf86cd799439011'
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: true
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
    required: true,
    uniqueItems: true
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    required: true,
    writeOnly: true
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    enum: ['admin', 'user'],
    default: 'user',
    required: true
  })
  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
  role: 'admin' | 'user';
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});