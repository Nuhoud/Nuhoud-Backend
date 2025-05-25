import { Controller, Get,Request, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { StepOneDto } from './dto/profile.dto';
import { request } from 'http';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  
  @Post('profileInfoStepOne')
  async addProfileInfoStepOne(@Body() stepOneInfo: StepOneDto, @Request() req: Request){
    const userId = req['user']._id;
    console.log(userId);
    return this.profilesService.addProfileInfoStepOne(userId, stepOneInfo);
  }
  
}
