import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth/guards/auth.guard';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { TestFcmDto } from './dto/test.dto';
import { FcmService } from './firebase.service';

@ApiTags('firebase')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly fcmService: FcmService) {}

  @Post('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Register device FCM token',
    description:
      'Registers (or updates) the authenticated user device token to enable push notifications.',
  })
  @ApiResponse({ status: 204, description: 'Device token registered successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async registerDevice(
    @Body() body: RegisterDeviceDto,
    @Request() req: Request,
  ): Promise<void> {
    //console.log(body.token);
    const userId = (req as any)?.user?._id;
    if (!userId) throw new UnauthorizedException('User context is missing');

    //console.log('Registering device token for user:', userId);

    await this.fcmService.registerDevice(
      String(userId),
      body.token,
      body.platform ?? 'web',
    );
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send test push notification',
    description:
      'Sends a test push notification via FCM to all active devices of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Test push notification sent',
    schema: {
      example: {
        message: 'Test push notification sent',
        success: 1,
        failure: 0,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'No registered devices for the user',
    schema: {
      example: {
        message: 'Test push notification sent',
        success: 0,
        failure: 0,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async testNotification(@Body() body: TestFcmDto, @Request() req: Request) {
    const userId = (req as any)?.user?._id;
    if (!userId) throw new UnauthorizedException('User context is missing');

    const result = await this.fcmService.sendToUser(String(userId), {
      title: body.title,
      body: body.body,
      data: body.data,
    });

    return { message: 'Test push notification sent', ...result };
  }
}
