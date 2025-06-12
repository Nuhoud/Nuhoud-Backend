import { Injectable,Inject, OnModuleInit, InternalServerErrorException,NotFoundException } from '@nestjs/common';
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

  async sumbitApplication( jobId:string, userId:string){
    const user = await this.usersService.findOne(userId);
    if(!user){
        throw new NotFoundException(`User with ID ${userId} not found`);
    }
    try{
      await firstValueFrom(
        this.kafkaClient.emit('job.application.submit', {
          jobId,
          user,
        })
      );
      return { status: 'ok' };
    }catch(error){
      throw new InternalServerErrorException('Failed to submit application');
    }
  }

}
