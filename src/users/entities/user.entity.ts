import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

// Embedded subdocuments schemas
@Schema({ _id: false })
export class Education {
  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  field: string;

  @Prop({ required: true })
  university: string;

  @Prop({ required: true })
  startYear?: number;

  @Prop()
  endYear?: number;

  @Prop()
  GPA?: number;
}

@Schema({ _id: false })
export class Experience {
  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: false })
  location?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  description?: string;
}

@Schema({ _id: false })
export class Certification {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  issuer: string;

  @Prop({ required: true })
  issueDate: Date;
}

@Schema({ _id: false })
export class Skill {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0, max: 100 })
  level: number;
}

@Schema({ _id: false })
export class Skills {
  @Prop({ type: [Skill], default: [] })
  technical_skills: Skill[];

  @Prop({ type: [Skill], default: [] })
  soft_skills: Skill[];
}

@Schema({ _id: false })
export class JobPreferences {
  @Prop({ enum: ['Remote', 'On-site'], required: true })
  workPlaceType: string;

  @Prop({ enum: ['Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Internship'], required: true })
  jobType: string;

  @Prop({ required: true })
  jobLocation: string;
}

@Schema({ _id: false })
export class Basic {
  @Prop({ enum: ['male', 'female'] })
  gender?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  location?: string;

  @Prop({ type: [String], default: [] })
  languages: string[];
}

@Schema({_id:false})
export class Goals {
  @Prop({ required: true })
  careerGoal: string;

  @Prop({ type: [String], default: [] })
  interests: string[];
}


// ------------------------------ the User scheam ------------------------------
@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, sparse: true, type: String })
  email: string;

  @Prop({ unique: true, sparse: true, type: String })
  mobile: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
  role: 'admin' | 'user';

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isFirstTime: boolean;

  @Prop({ default: false })
  isCompleted: boolean;

  // Profile fields - Basic Info
  @Prop({ type: Basic })
  basic:Basic;

  // Profile fields - Professional Info (Embedded Documents)
  @Prop({ type: [Education], default: [] })
  education: Education[];

  @Prop({ type: [Experience], default: [] })
  experience: Experience[];

  @Prop({ type: [Certification], default: [] })
  certifications: Certification[];

  @Prop({ type: Skills })
  skills?: Skills;

  // Profile fields - Career Info
  @Prop({ type: JobPreferences })
  jobPreferences?: JobPreferences;

  @Prop({ type: Goals })
  goals?:Goals;
}

export const UserSchema = SchemaFactory.createForClass(User);


// Add indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ mobile: 1 });
UserSchema.index({ 'jobPreferences.jobLocation': 1 });
UserSchema.index({ 'skills.technical_skills.name': 1 });

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

// Export embedded schemas for potential reuse
export const EducationSchema = SchemaFactory.createForClass(Education);
export const WorkExperienceSchema = SchemaFactory.createForClass(Experience);
export const CertificationSchema = SchemaFactory.createForClass(Certification);
export const SkillSchema = SchemaFactory.createForClass(Skill);
export const SkillsSchema = SchemaFactory.createForClass(Skills);
export const JobPreferencesSchema = SchemaFactory.createForClass(JobPreferences);