import { Injectable } from '@nestjs/common';
import { SkillsDto, StepOneDto } from '../profiles/dto/profile.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { genderMap, workPlaceTypeMap, jobTypeMap } from './dto/dictionary';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AiserviceService {
  constructor(private httpService: HttpService) {}

  async getRecomandedSkills(stepOneInfo: StepOneDto): Promise<SkillsDto | undefined> {
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
              workPlaceType:
                workPlaceTypeMap[stepOneInfo.jobPreferences.workPlaceType] ||
                stepOneInfo.jobPreferences.workPlaceType,
              jobType:
                jobTypeMap[stepOneInfo.jobPreferences.jobType] ||
                stepOneInfo.jobPreferences.jobType
            }
          : undefined
      };

      const response = await lastValueFrom(
        this.httpService.post(`${process.env.AI_SERVICE_URL}/getRecomandedSkills`, {
          stepOneInfo: translatedStepOneInfo
        })
      );

      return response.data;
    } catch (error) {
      throw new Error('Failed to get recomanded skills');
    }
  }


}
