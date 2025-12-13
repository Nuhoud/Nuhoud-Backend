import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';


// Embedded subdocuments schemas
@Schema({ _id: false })
export class Education {
  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  field: string;

  @Prop({ required: true })
  university: string;

/*   @Prop({ required: true })
  startYear?: number; */

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

  @Prop({ default: false })
  isCurrent?: boolean;

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
  @Prop({ type: [String], enum: ['عن بعد', 'في الشركة','مزيج'], required: true })
  workPlaceType: string[];
  
  @Prop({ type: [String], enum: ['دوام كامل', 'دوام جزئي', 'عقد', 'مستقل', 'تدريب'], required: true })
  jobType: string[];

  @Prop({ required: true })
  jobLocation: string;
}

@Schema({ _id: false })
export class Basic {
  @Prop({ enum: ['ذكر', 'أنثى'] })
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

@Schema({ _id: false })
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  industry: string;

  @Prop()
  website?: string;

  @Prop()
  description?: string;

  @Prop()
  location?: string;

  @Prop({ 
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: true 
  })
  size: string;
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

  @Prop()
  url?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['admin', 'user','employer'], default: 'user' })
  role: 'admin' | 'user' | 'employer';

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isFirstTime: boolean;

  // Fields only for regular users
  @Prop({ 
    default: function() {
      return this.role === 'user' ? false : undefined;
    }
  })
  isCompleted?: boolean;

  @Prop({ 
    type: Basic,
    validate: {
      validator: function(value) {
        // Only validate if role is 'user'
        return this.role !== 'user' || value != null;
      },
      message: 'Basic info is required for regular users'
    }
  })
  basic?: Basic;

  @Prop({ 
    type: [Education], 
    default: function() {
      return this.role === 'user' ? [] : undefined;
    }
  })
  education?: Education[];

  @Prop({ 
    type: [Experience], 
    default: function() {
      return this.role === 'user' ? [] : undefined;
    }
  })
  experiences?: Experience[];

  @Prop({ 
    type: [Certification], 
    default: function() {
      return this.role === 'user' ? [] : undefined;
    }
  })
  certifications?: Certification[];

  @Prop({ type: Skills })
  skills?: Skills;

  @Prop({ type: JobPreferences })
  jobPreferences?: JobPreferences;

  @Prop({ type: Goals })
  goals?: Goals;

  // Company field only for employers
  @Prop({ 
    type: Company,
    validate: {
      validator: function(value) {
        // Only validate if role is 'employer'
        return this.role !== 'employer' || value != null;
      },
      message: 'Company info is required for employers'
    }
  })
  company?: Company;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save middleware to clean up fields based on role
UserSchema.pre('save', function(next) {
  const user = this as any;
  
  switch (user.role) {
    case 'admin':
      // Remove user-specific and employer-specific fields
      user.isCompleted = undefined;
      user.basic = undefined;
      user.education = undefined;
      user.experiences = undefined;
      user.certifications = undefined;
      user.skills = undefined;
      user.jobPreferences = undefined;
      user.goals = undefined;
      user.company = undefined;
      break;
      
    case 'employer':
      // Remove user-specific fields
      user.isCompleted = undefined;
      user.basic = undefined;
      user.education = undefined;
      user.experiences = undefined;
      user.certifications = undefined;
      user.skills = undefined;
      user.jobPreferences = undefined;
      user.goals = undefined;
      break;
      
    case 'user':
      // Remove employer-specific fields
      user.company = undefined;
      break;
  }
  
  next();
});

// Add indexes for better query performance
/* UserSchema.index({ email: 1 });
UserSchema.index({ mobile: 1 }); */
UserSchema.index({ role: 1 });
UserSchema.index({ 'jobPreferences.jobLocation': 1 });
UserSchema.index({ 'skills.technical_skills.name': 1 });

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    // Remove role-specific fields from JSON output
    switch (ret.role) {
      case 'admin':
        delete ret.isCompleted;
        delete ret.basic;
        delete ret.education;
        delete ret.experiences;
        delete ret.certifications;
        delete ret.skills;
        delete ret.jobPreferences;
        delete ret.goals;
        delete ret.company;
        break;
      case 'employer':
        delete ret.isCompleted;
        delete ret.basic;
        delete ret.education;
        delete ret.experiences;
        delete ret.certifications;
        delete ret.skills;
        delete ret.jobPreferences;
        delete ret.goals;
        break;
      case 'user':
        delete ret.company;
        break;
    }
    
    return ret;
  },
});

export type UserDocument = User & Document;
