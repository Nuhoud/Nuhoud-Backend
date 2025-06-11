import { Injectable,Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { UsersService } from '../users/users.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApplicationService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async sumbitApplication( jobId:string, userId:string){
    const user = await this.usersService.findOne(userId);
    
    await firstValueFrom(
      this.kafkaClient.emit('job.application.submit', {
        jobId,
        user,
      })
    );

    return { status: 'ok' };
  }

}
