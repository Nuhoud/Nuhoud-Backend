import { Injectable, NotFoundException, BadRequestException, Logger, InternalServerErrorException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Basic, User, UserDocument } from '../users/entities/user.entity';
import { SkillsDto, StepOneDto } from './dto/profile.dto'
import { AiserviceService } from '../aiservice/aiservice.service';
import { UpdateProfileDto } from './dto/update-profile.dto'


@Injectable()
export class ProfilesService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private aiService: AiserviceService,
    ){}


    async getProfile(userId: string){
        try{
            let user = await this.userModel.findById(userId).exec();
            if(!user){
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            return user;
        }catch(error){
            if(error.name === 'CastError'){
                throw new BadRequestException('Invalid user ID format');
            }
            throw new InternalServerErrorException('Failed to get profile');
        }
    }

    async editProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        try {
            const user = await this.userModel.findById(userId).exec();
            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
    
            // Update basic info
            if (updateProfileDto.basicInfo) {
                if (!user.basic) {
                    user.basic = {} as any;
                }
                
                if (updateProfileDto.basicInfo.gender !== undefined) {
                    user.basic!.gender = updateProfileDto.basicInfo.gender;
                }
                if (updateProfileDto.basicInfo.dateOfBirth !== undefined) {
                    user.basic!.dateOfBirth = new Date(updateProfileDto.basicInfo.dateOfBirth);
                }
                if (updateProfileDto.basicInfo.location !== undefined) {
                    user.basic!.location = updateProfileDto.basicInfo.location;
                }
                if (updateProfileDto.basicInfo.languages !== undefined) {
                    user.basic!.languages = updateProfileDto.basicInfo.languages;
                }
            }
    
            // Update education
            if (updateProfileDto.education !== undefined) {
                const validEducation = updateProfileDto.education.filter(edu => 
                    edu.degree && edu.field && edu.university && edu.endYear
                ) as any[];
                user.education = validEducation;
            }
    
            // Update experiences
            if (updateProfileDto.experiences !== undefined) {
                const validExperiences = updateProfileDto.experiences
                    .filter(exp => exp.jobTitle && exp.company)
                    .map(exp => ({
                        jobTitle: exp.jobTitle!,
                        company: exp.company!,
                        location: exp.location,
                        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
                        endDate: exp.endDate ? new Date(exp.endDate) : undefined,
                        isCurrent: exp.isCurrent,
                        description: exp.description
                    })) as any[];
                user.experiences = validExperiences;
            }
    
            // Update certifications
            if (updateProfileDto.certifications !== undefined) {
                const validCertifications = updateProfileDto.certifications
                    .filter(cert => cert.name && cert.issuer && cert.issueDate)
                    .map(cert => ({
                        name: cert.name!,
                        issuer: cert.issuer!,
                        issueDate: new Date(cert.issueDate!)
                    })) as any[];
                user.certifications = validCertifications;
            }
    
            // Update job preferences
            if (updateProfileDto.jobPreferences !== undefined) {
                if (!user.jobPreferences) {
                    user.jobPreferences = {} as any;
                }
                
                if (updateProfileDto.jobPreferences.workPlaceType !== undefined) {
                    user.jobPreferences!.workPlaceType = updateProfileDto.jobPreferences.workPlaceType;
                }
                if (updateProfileDto.jobPreferences.jobType !== undefined) {
                    user.jobPreferences!.jobType = updateProfileDto.jobPreferences.jobType;
                }
                if (updateProfileDto.jobPreferences.jobLocation !== undefined) {
                    user.jobPreferences!.jobLocation = updateProfileDto.jobPreferences.jobLocation;
                }
            }
    
            // Update goals
            if (updateProfileDto.goals !== undefined) {
                if (!user.goals) {
                    user.goals = {} as any;
                }
                
                if (updateProfileDto.goals.careerGoal !== undefined) {
                    user.goals!.careerGoal = updateProfileDto.goals.careerGoal;
                }
                if (updateProfileDto.goals.interests !== undefined) {
                    user.goals!.interests = updateProfileDto.goals.interests;
                }
            }
    
            // Update skills
            if (updateProfileDto.skills !== undefined) {
                if (!user.skills) {
                    user.skills = {} as any;
                }
                
                if (updateProfileDto.skills.technical_skills !== undefined) {
                    const validTechnicalSkills = updateProfileDto.skills.technical_skills
                        .filter(skill => skill.name !== undefined && skill.level !== undefined)
                        .map(skill => ({
                            name: skill.name!,
                            level: skill.level!
                        })) as any[];
                    user.skills!.technical_skills = validTechnicalSkills;
                }
                if (updateProfileDto.skills.soft_skills !== undefined) {
                    const validSoftSkills = updateProfileDto.skills.soft_skills
                        .filter(skill => skill.name !== undefined && skill.level !== undefined)
                        .map(skill => ({
                            name: skill.name!,
                            level: skill.level!
                        })) as any[];
                    user.skills!.soft_skills = validSoftSkills;
                }
            }
    
            await user.save();
            return user;
            
        } catch (error) {
            if (error.name === 'CastError') {
                throw new BadRequestException('Invalid user ID format');
            }
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to edit profile');
        }
    }


    async addProfileInfoStepOne(userId: string, stepOneInfo: StepOneDto){
        try{
            
            let user = await this.userModel.findById(userId).exec();
            //console.log(userId + user);
            if(!user){
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            console.log(user);
            // Convert string dates to Date objects
            const basicInfo = {
                ...stepOneInfo.basicInfo,
                dateOfBirth: stepOneInfo.basicInfo.dateOfBirth ? new Date(stepOneInfo.basicInfo.dateOfBirth) : undefined
            };
            
            const experience = stepOneInfo.experiences?.map(exp => ({
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
            user.experiences = experience || [];
            user.certifications = certifications || [];
            user.jobPreferences = stepOneInfo.jobPreferences;
            user.goals = stepOneInfo.goals;
            
            await user.save();
            //return await this.aiService.getRecomandedSkills(stepOneInfo);
                        
        }catch(error){
            if(error.name === 'CastError'){
                throw new BadRequestException('Invalid user ID format');
            }
            throw new InternalServerErrorException('Failed to add step one info');
        }
    }

    async addProfileInfoStepTwo(userId: string, stepTwoInfo: SkillsDto){
        try{
            let user = await this.userModel.findById(userId).exec();
            if(!user){
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            user.skills = stepTwoInfo;

            await user.save();
            //return await this.aiService.getRecomandedPlan(user);
        }catch(error){
            if(error.name === 'CastError'){
                throw new BadRequestException('Invalid user ID format');
            }
            throw new InternalServerErrorException('Failed to add step two info');
        }
    }
  

}
