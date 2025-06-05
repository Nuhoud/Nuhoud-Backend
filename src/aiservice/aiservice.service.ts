import { Injectable } from '@nestjs/common';
import { SkillsDto, StepOneDto } from '../profiles/dto/profile.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AiserviceService {

    constructor(private httpService: HttpService) {}

    async getRecomandedSkills(stepOneInfo: StepOneDto): Promise<SkillsDto | undefined>{
        try{
            const response = await lastValueFrom(
                    this.httpService.post(`${process.env.AI_SERVICE_URL}/getRecomandedSkills`, {
                    stepOneInfo
                })
            );
            //console.log(response.data);
            return response.data;
        } catch (error) {
            throw new Error('Failed to get recomanded skills');
        }
    }
}
