import { Injectable, NotFoundException, BadRequestException, Logger, InternalServerErrorException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Basic, User, UserDocument } from '../users/entities/user.entity';
import { StepOneDto } from './dto/profile.dto'


@Injectable()
export class ProfilesService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ){}

    async addProfileInfoStepOne(userId: Types.ObjectId, stepOneInfo: StepOneDto){
        try{
            let user = await this.userModel.findById(userId).exec();
            if(!user){
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            
            // Convert string dates to Date objects
            const basicInfo = {
                ...stepOneInfo.basicInfo,
                dateOfBirth: stepOneInfo.basicInfo.dateOfBirth ? new Date(stepOneInfo.basicInfo.dateOfBirth) : undefined
            };
            
            const experience = stepOneInfo.experience?.map(exp => ({
                ...exp,
                startDate: exp.startDate ? new Date(exp.startDate) : undefined,
                endDate: exp.endDate ? new Date(exp.endDate) : undefined
            }));
            
            const certifications = stepOneInfo.certifications?.map(cert => ({
                ...cert,
                issueDate: new Date(cert.issueDate)
            }));
            
            user.isFirstTime = false;
            user.basic = basicInfo;
            user.education = stepOneInfo.education;
            user.experience = experience || [];
            user.certifications = certifications || [];
            user.jobPreferences = stepOneInfo.jobPreferences;
            user.goals = stepOneInfo.goals;

            return await user.save();
            
        }catch(error){
            if(error.name === 'CastError'){
                throw new BadRequestException('Invalid user ID format');
            }
            throw new InternalServerErrorException('Failed to add step one info');
        }
    }

    
  

}
