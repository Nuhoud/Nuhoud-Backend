import { Controller, Get,Request, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { SkillsDto, StepOneDto } from './dto/profile.dto';
import { request } from 'http';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // get user profile
  @ApiOkResponse({ 
    description: 'Returns a user profile',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('my-profile')
  async getProfile(@Request() req: Request) {
    //console.log(req)
    return this.profilesService.getProfile(req['user']._id);
  }

  //edit my profile
  @ApiOkResponse({ 
    description: 'Returns a user profile',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch('my-profile')
  async editProfile(@Body() updateUserDto: UpdateProfileDto, @Request() req: Request) {
    const userId = req['user']._id;
    console.log(updateUserDto);
    return this.profilesService.editProfile(userId, updateUserDto);
  }
  
  @Post('profileInfoStepOne')
  async addProfileInfoStepOne(@Body() stepOneInfo: StepOneDto, @Request() req: Request){
    const userId = req['user']._id;
    //console.log(userId);
    return this.profilesService.addProfileInfoStepOne(userId, stepOneInfo);
  }

  @Post('profileInfoStepTwo')
  async addProfileInfoStepTwo(@Body() stepTwoInfo: SkillsDto,@Request() req: Request ){
    const userId = req['user']._id;
    return this.profilesService.addProfileInfoStepTwo(userId, stepTwoInfo);
  }
  
}
