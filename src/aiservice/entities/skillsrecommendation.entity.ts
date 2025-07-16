import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types, Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SkillsDto } from '../../profiles/dto/profile.dto';

export type SkillsRecommendationDocument = SkillsRecommendation & Document;

@Schema({ timestamps: true })
export class SkillsRecommendation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'User ID this skills recommendation belongs to' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @ApiProperty({ type: SkillsDto, description: 'Recommended skills payload' })
  @Prop({ type: Object, required: true })
  skills: SkillsDto;
}

export const SkillsRecommendationSchema = SchemaFactory.createForClass(SkillsRecommendation);
