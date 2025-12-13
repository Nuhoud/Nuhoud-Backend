import { Controller, Get,Request, Post, Body, Patch, Param, Delete,BadGatewayException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { Minios3Service } from '../minios3/minios3.service';
import { SkillsDto, StepOneDto } from './dto/profile.dto';
import { request } from 'http';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('profile')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly minioS3Service: Minios3Service,
  ) {}

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
    try {
      await this.profilesService.addProfileInfoStepOne(userId, stepOneInfo);
  
      // success → tell Flutter to start polling
      return {
        success: true,
        status: 'processing',
        pollUrl: '/aiservice/skills',          // where Flutter should poll
      };
    } catch (e) {
      // couldn’t forward to n8n or save data
      throw new BadGatewayException({
        success: false,
        message: 'Failed to start AI workflow',
      });
    }
  }

  @Post('profileInfoStepTwo')
  async addProfileInfoStepTwo(@Body() stepTwoInfo: SkillsDto,@Request() req: Request ){
    const userId = req['user']._id;
    try {
      await this.profilesService.addProfileInfoStepTwo(userId, stepTwoInfo);
  
      // success → tell Flutter to start polling
      return {
        success: true,
        status: 'processing',
        pollUrl: '/aiservice/devplan',// where Flutter should poll
      };
    } catch (e) {
      // couldn’t forward to n8n or save data
      throw new BadGatewayException({
        success: false,
        message: 'Failed to start AI workflow',
      });
    }
  }

  @Post('photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadPhoto(@UploadedFile() file, @Request() req) {
    // validate size/mime; accept only png/jpg/webp
    const { bucket, objectKey } = await this.minioS3Service.uploadUserAvatar(req.user._id, file);
    const url = await this.minioS3Service.presignedGet(bucket, objectKey);
    await this.profilesService.updatePhoto(req.user._id, url);
    return { url };
  }

}
