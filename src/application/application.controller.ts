import { Body, Controller, Inject, OnModuleInit, Param, Post, Request } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ApplicationService } from './application.service';
import { submitApplication } from './dto/submit-application.dot'

@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService
  ) {}

  
  @Post('submit/:id')
  async submitApplication(
    @Param('id') jobId: string,
    @Body() joboffer: submitApplication,
    @Request() req: Request,
  ) {
    const userId = req['user']._id;
    return this.applicationService.sumbitApplication( jobId, userId);
  }

  @MessagePattern('job.application.statusChange')
  handleStatusChange(@Payload() message: any) {
    console.log('Received status change:', message);
  }

}
