import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type DevplanDocument = Devplan & Document;

// Job schema for step1
@Schema({ _id: false })
export class Job {
  @ApiProperty({ description: 'Job ID' })
  @Prop({ required: true })
  _id: string;

  @ApiProperty({ description: 'Job offer title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Company name' })
  @Prop({ required: false })
  company: string;

  @ApiProperty({ description: 'Reason why this job matches the user' })
  @Prop({ required: true })
  match: string;

  @ApiProperty({ description: 'Match score percentage' })
  @Prop({ required: true, min: 0, max: 100 })
  matchScore: number;
}

// Task schema for step2
@Schema({ _id: false })
export class Task {
  @ApiProperty({ description: 'Week number' })
  @Prop({ required: true })
  week: number;

  @ApiProperty({ description: 'Array of tasks for this week' })
  @Prop({ type: [String], required: true })
  tasks: string[];
}

// Month schema for step2
@Schema({ _id: false })
export class Month {
  @ApiProperty({ description: 'Month title' })
  @Prop({ required: true })
  month: string;

  @ApiProperty({ description: 'Tasks for this month', type: [Task] })
  @Prop({ type: [Task], required: true })
  tasks: Task[];
}

// Step1 schema
@Schema({ _id: false })
export class Step1 {
  @ApiProperty({ description: 'Recommended jobs', type: [Job] })
  @Prop({ type: [Job], required: true })
  jobs: Job[];
}

// Step2 schema
@Schema({ _id: false })
export class Step2 {
  @ApiProperty({ description: 'Monthly development plan', type: [Month] })
  @Prop({ type: [Month], required: true })
  months: Month[];
}

@Schema({ timestamps: true })
export class Devplan {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: Types.ObjectId;

    @ApiProperty({ description: 'User ID this development plan belongs to' })
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @ApiProperty({ description: 'Step 1: Recommended jobs', type: Step1 })
    @Prop({ type: Step1, required: true })
    step1: Step1;

    @ApiProperty({ description: 'Step 2: Monthly development plan', type: Step2 })
    @Prop({ type: Step2, required: true })
    step2: Step2;
}

export const DevplanSchema = SchemaFactory.createForClass(Devplan);
