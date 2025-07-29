import { AiserviceService } from './aiservice.service';
import { Controller, Post, Get, Query, Request, Body, Patch, Param, Delete,HttpException, HttpStatus, HttpCode, ParseIntPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { Public } from '../public.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse,ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enums';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { CreateDevplanDto } from './dto/create-devplan.dto';
import { Devplan } from './entities/devplan,entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SkillsDto } from '../profiles/dto/profile.dto';


@ApiTags('AI Service')
@ApiBearerAuth()
@Controller('aiservice')
@UseGuards(AuthGuard)
export class AiserviceController {
  constructor(private readonly aiserviceService: AiserviceService) {}


  // Webhook from n8n to save recommended skills 
  @Post('skills/:userId')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Webhook from n8n to save recommended skills' })
  @ApiBody({ type: [SkillsDto] })
  async saveRecommendedSkills(@Param('userId') userId: string, @Body() skillsDto: SkillsDto[]) {
    await this.aiserviceService.saveRecommendedSkillsForUser(userId, skillsDto[0]);
    return { success: true };
  }

  // Polling endpoint for Flutter to fetch recommended skills
  @Get('skills')
  @Roles(Role.USER)
  @ApiOkResponse({ description: 'Recommended skills ready', type: SkillsDto })
  @ApiNoContentResponse({ description: 'Skills not ready yet (still processing)' })
  @ApiOperation({ summary: 'Polling endpoint for Flutter to fetch recommended skills' })
  async getRecommendedSkills(@Request() req: Request) {
    const userId = req['user']._id;
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const skills = await this.aiserviceService.getRecommendedSkillsForUser(userId);
      if (!skills) {
        throw new HttpException('', HttpStatus.NO_CONTENT); // 204
      }

      return { success: true, data: skills };
    } catch (error) {
        throw error;
    }
  }


  // Webhook from n8n to save Development plan for user
  @Post('devplan/:userId')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Webhook from n8n to Create development plan from AI service',
    description: 'Creates a new development plan for a user based on AI recommendations'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'User ID to create development plan for',
    type: 'string'
  })
  @ApiBody({ 
    type: [CreateDevplanDto],
    description: 'Development plan data from AI service'
  })
  async createDevelopmentPlan(@Param('userId') userId: string,@Body() createDevplanDto: CreateDevplanDto[]) {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const result = await this.aiserviceService.createDevelopmentPlan(userId, createDevplanDto[0]);
      return {
        success: true,
        message: 'Development plan created successfully',
        data: result
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create development plan');
    }
  }

  @Get('devplan')
  @Roles(Role.USER)
  @ApiOkResponse({ description: 'Development plan ready', type: Devplan })
  @ApiNoContentResponse({ description: 'Development plan not ready yet (still processing)' })
  @ApiOperation({ 
    summary: 'Get development plan for user',
    description: 'Retrieves the development plan for a specific user'
  })
  async getDevelopmentPlan(@Request() req: Request) {
    const userId = req['user']._id;
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const devplan = await this.aiserviceService.getDevelopmentPlan(userId);
      if (!devplan) {
        throw new HttpException('', HttpStatus.NO_CONTENT); // 204
      }

      return { success: true, data: devplan };
    } catch (error) {
        throw error;
    }
  }

  @Patch('devplan/:userId')
  @Public()
  @ApiOperation({ 
    summary: 'Update development plan for user',
    description: 'Updates the development plan for a specific user'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'User ID to update development plan for',
    type: 'string'
  })
  @ApiBody({ 
    type: CreateDevplanDto,
    description: 'Updated development plan data'
  })
  async updateDevelopmentPlan(@Param('userId') userId: string,@Body() updateDevplanDto: CreateDevplanDto) {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const result = await this.aiserviceService.updateDevelopmentPlan(userId, updateDevplanDto);
      return {
        success: true,
        message: 'Development plan updated successfully',
        data: result
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update development plan');
    }
  }

  @Delete('devplan/:userId')
  @ApiOperation({ 
    summary: 'Delete development plan for user',
    description: 'Deletes the development plan for a specific user'
  })
  @Roles(Role.ADMIN)
  @ApiParam({ 
    name: 'userId', 
    description: 'User ID to delete development plan for',
    type: 'string'
  })
  async deleteDevelopmentPlan(@Param('userId') userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const result = await this.aiserviceService.deleteDevelopmentPlan(userId);
      if (!result) {
        throw new NotFoundException('Development plan not found for this user');
      }

      return {
        success: true,
        message: 'Development plan deleted successfully'
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete development plan');
    }
  }
}
