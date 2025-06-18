import { Injectable,Inject, OnModuleInit, BadRequestException,InternalServerErrorException,NotFoundException } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UsersService } from '../users/users.service';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class ApplicationService {
  constructor(
    private usersService: UsersService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async sendKafkaEvent( topicName:string , value :any){
    await firstValueFrom(
        this.kafkaClient.emit(topicName, {
            value
        })
    )
  }


  async sumbitApplication( jobOfferId:string,joboffer: CreateApplicationDto, userId:string){
    const user = await this.usersService.findOne(userId);
    if(!user){
        throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (user.role !== 'user') {
      throw new BadRequestException('Only regular users can submit applications');
    }

    const employer = await this.usersService.findOne(joboffer.employerId);
    if(!employer){
      throw new NotFoundException(`Employer with ID ${joboffer.employerId} not found`);
    }
    const employerEmail = employer.email;
    const companyName = employer.company?.name;
    const title = joboffer.title;
    
    const userSnap = {
      name: user.name,
      ...(user.email && { email: user.email }), 
      ...(user.mobile && { mobile: user.mobile }),
      ...(user.basic && { basic: user.basic }),
      education: user.education || [],
      experiences: user.experiences || [],
      certifications: user.certifications || [],
      ...(user.skills && { skills: user.skills }),
      ...(user.jobPreferences && { jobPreferences: user.jobPreferences }),
      ...(user.goals && { goals: user.goals })
    };

    try{
      await this.sendKafkaEvent('job.application.submit',{
        jobOfferId,
        userId,
        title,
        employerEmail,
        userSnap,
      });
      return { status: 'ok' };
    }catch(error){
      throw new InternalServerErrorException('Failed to submit application');
    }
  }
  

}
