import { Body, Controller, HttpCode,HttpStatus,Inject, OnModuleInit, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto'
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
  ) {}

  
  @Post('submit/:id')
  @HttpCode(HttpStatus.OK)
  async submitApplication(
    @Param('id') jobId: string,
    @Body() joboffer: CreateApplicationDto,
    @Request() req: Request,
  ) {
    const userId = req['user']._id;
    return this.applicationService.sumbitApplication( jobId,joboffer, userId);
  }
  

  /*   
  @EventPattern('job.application.statusChange')
  handleStatusChange(@Payload() message: any) {
    console.log('Received status change:', message);
  } 
  */

}
