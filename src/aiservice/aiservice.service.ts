import { Injectable, BadRequestException, NotFoundException, BadGatewayException } from '@nestjs/common';
import { SkillsDto, StepOneDto } from '../profiles/dto/profile.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { genderMap, workPlaceTypeMap, jobTypeMap } from './dto/dictionary';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from '../users/entities/user.entity';
import { Devplan, DevplanDocument } from './entities/devplan,entity';
import { CreateDevplanDto } from './dto/create-devplan.dto';
import { SkillsRecommendation, SkillsRecommendationDocument } from './entities/skillsrecommendation.entity';

dotenv.config();

@Injectable()
export class AiserviceService {
  constructor(
    private httpService: HttpService,
    @InjectModel(Devplan.name) private DevplanModel: Model<DevplanDocument>,
    @InjectModel(SkillsRecommendation.name) private SkillsRecModel: Model<SkillsRecommendationDocument>,
  ) {}


  // Create Development Plan received from n8n webhook
  async createDevelopmentPlan(userId: string, createDevplanDto: CreateDevplanDto): Promise<Devplan> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const existingPlan = await this.DevplanModel.findOne({ userId: new Types.ObjectId(userId) });
      if (existingPlan) {
        throw new BadRequestException('User already has a development plan. Please update the existing one.');
      }

      const newDevplan = new this.DevplanModel({
        userId: new Types.ObjectId(userId),
        step1: createDevplanDto.step1,
        step2: createDevplanDto.step2
      });

      const savedPlan = await newDevplan.save();
      return savedPlan;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create development plan: ' + error.message);
    }
  }

  // Retrieve Development Plan for polling endpoint
  async getDevelopmentPlan(userId: string): Promise<Devplan | null> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const devplan = await this.DevplanModel.findOne({ userId: new Types.ObjectId(userId) });
      return devplan;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve development plan: ' + error.message);
    }
  }

  // delete user Development Plan by ADMIN endpint
  async deleteDevelopmentPlan(userId: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const result = await this.DevplanModel.deleteOne({ userId: new Types.ObjectId(userId) });
      return result.deletedCount > 0;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete development plan: ' + error.message);
    }
  }


  // Update Development Plan received from n8n webhook
  async updateDevelopmentPlan(userId: string, updateDevplanDto: CreateDevplanDto): Promise<Devplan> {
    try {
      // Validate userId format
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const updatedPlan = await this.DevplanModel.findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        {
          step1: updateDevplanDto.step1,
          step2: updateDevplanDto.step2
        },
        { new: true, runValidators: true }
      );

      if (!updatedPlan) {
        throw new NotFoundException('Development plan not found for this user');
      }

      return updatedPlan;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update development plan: ' + error.message);
    }
  }

  // Save recommended skills payload received from n8n webhook
  async saveRecommendedSkillsForUser(userId: string, skills: SkillsDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }
    await this.SkillsRecModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { skills },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }
  // Retrieve recommended skills for polling endpoint
  async getRecommendedSkillsForUser(userId: string): Promise<SkillsDto | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }
    const rec = await this.SkillsRecModel.findOne({ userId: new Types.ObjectId(userId) }).lean();
    return rec ? (rec as any).skills : null;
  }

  // used by profile module
  async generateSkills(stepOneInfo: StepOneDto){
    try {
      // translation to english
      const translatedStepOneInfo: StepOneDto = {
        ...stepOneInfo,
        basicInfo: {
          ...stepOneInfo.basicInfo,
          gender: genderMap[stepOneInfo.basicInfo.gender] || stepOneInfo.basicInfo.gender
        },
        jobPreferences: stepOneInfo.jobPreferences
          ? {
              ...stepOneInfo.jobPreferences,
              workPlaceType: Array.isArray(stepOneInfo.jobPreferences.workPlaceType)
                ? stepOneInfo.jobPreferences.workPlaceType.map(jt => workPlaceTypeMap[jt] || jt)
                : [workPlaceTypeMap[stepOneInfo.jobPreferences.workPlaceType] || stepOneInfo.jobPreferences.workPlaceType],
              jobType: Array.isArray(stepOneInfo.jobPreferences.jobType)
                ? stepOneInfo.jobPreferences.jobType.map(jt => jobTypeMap[jt] || jt)
                : [jobTypeMap[stepOneInfo.jobPreferences.jobType] || stepOneInfo.jobPreferences.jobType]
            }
          : undefined
      };

      await lastValueFrom(
        this.httpService.post(`${process.env.N8N_URL}/webhook/step1`, translatedStepOneInfo),
      );

    } catch (error) {
      throw new BadGatewayException('n8n call failed');
    }
  }

  //used by profile module
  async generateDevPlan(user: any) {
    try{
      await lastValueFrom(
        this.httpService.post(`${process.env.N8N_URL}/webhook/step2`, user),
      );
    }catch(error){
      throw new BadGatewayException('n8n call failed');
    }
  }

}
