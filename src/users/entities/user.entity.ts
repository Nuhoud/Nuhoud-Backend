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
  startYear: number;

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

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  startDate: Date;

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
  @Prop({ enum: ['male', 'female'] })
  gender?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  location?: string;

  @Prop({ type: [String], default: [] })
  languages: string[];




  // Profile fields - Professional Info (Embedded Documents)
  @Prop({ type: [Education], default: [] })
  education: Education[];

  @Prop({ type: [Experience], default: [] })
  Experience: Experience[];

  @Prop({ type: [Certification], default: [] })
  certifications: Certification[];

  @Prop({ type: Skills })
  skills?: Skills;

  // Profile fields - Career Info
  @Prop({ type: JobPreferences })
  jobPreferences?: JobPreferences;

  @Prop()
  careerGoal?: string;

  @Prop({ type: [String], default: [] })
  interests: string[];



  // Profile completion tracking
  @Prop({
    type: {
      basicInfo: { type: Boolean, default: false },
      education: { type: Boolean, default: false },
      experience: { type: Boolean, default: false },
      certifications: { type: Boolean, default: false },
      preferences: { type: Boolean, default: false },
      goals: { type: Boolean, default: false },
      skills: { type: Boolean, default: false }
    },
    default: {
      basicInfo: false,
      education: false,
      experience: false,
      certifications: false,
      preferences: false,
      goals: false,
      skills: false
    }
  })
  profileCompletion: {
    basicInfo: boolean;
    education: boolean;
    experience: boolean;
    certifications: boolean;
    preferences: boolean;
    goals: boolean;
    skills: boolean;
  };

  // Helper method to check if profile is complete
  isProfileComplete(): boolean {
    return Object.values(this.profileCompletion).every(step => step === true);
  }

  // Helper method to get completion percentage
  getCompletionPercentage(): number {
    const steps = Object.values(this.profileCompletion);
    const completedSteps = steps.filter(step => step === true).length;
    return Math.round((completedSteps / steps.length) * 100);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);


// Add indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ mobile: 1 });
UserSchema.index({ 'jobPreferences.jobLocation': 1 });
UserSchema.index({ 'skills.technical_skills.name': 1 });

// Pre-save middleware to update profile completion

UserSchema.pre('save', function(next) {
  if (this.isModified()) {
    const completion = this.profileCompletion;
    
    // Update completion status for each section
    completion.basicInfo = !!(this.gender && this.dateOfBirth && this.location && this.languages.length > 0);
    completion.education = this.education.length > 0;
    completion.experience = this.Experience.length > 0;
    completion.certifications = this.certifications.length > 0;
    completion.preferences = !!(this.jobPreferences?.workPlaceType && this.jobPreferences?.jobType);
    completion.goals = !!(this.careerGoal && this.interests.length > 0);
    completion.skills = !!(((this.skills?.technical_skills?.length ?? 0) > 0) || ((this.skills?.soft_skills?.length ?? 0) > 0));

    // Update isCompleted based on profile completion
    this.isCompleted = this.isProfileComplete();
  }
  next();
});

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