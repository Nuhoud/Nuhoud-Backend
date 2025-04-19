import { Body, Controller, Get, HttpCode, HttpStatus, Request, Post, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles/roles.guard'
import { Public } from 'src/public.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { resultUserDto } from './dto/result-atuh.dto';
import { Role } from './enums/role.enums';
import { Roles } from './decorators/roles.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { SignupDto } from './dto/signup-auth.dto';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {

    constructor(private authService: AuthService) {}


    // signUP user
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: SignupDto, description: 'User registration data' })
    @ApiCreatedResponse({ 
        description: 'User has been successfully created',
        type: SignupDto 
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @HttpCode(HttpStatus.CREATED)
    @Public()
    @Post('signup')
    Signup(@Body() signupUser: SignupDto, @Query('isMobile') isMobile: boolean = false) {
        ///console.log("gg");
        return this.authService.signup(signupUser, isMobile);
    }


    @ApiOperation({ summary: 'Verify OTP for user registration' })
    @ApiBody({ type: VerifyOtpDto, description: 'OTP verification data' })
    @ApiOkResponse({
        description: 'OTP has been successfully verified',
        type: resultUserDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('verify-otp')
    vefifySignup(@Body() verifyOtp: VerifyOtpDto, @Query('isMobile') isMobile: boolean = false) {
        return this.authService.verifyOtp(verifyOtp, isMobile);
    }

    @ApiOperation({ summary: 'Resend OTP for user registration' })
    @ApiBody({ type: ResendOtpDto, description: 'Resend OTP data' })
    @ApiOkResponse({
        description: 'OTP has been successfully resent',
        type: resultUserDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('resend-otp')
    resendOTP(@Body() resendOtp: ResendOtpDto, @Query('isMobile') isMobile: boolean = false) {
        return this.authService.resendOtp(resendOtp, isMobile);
    }

    
    // signup admin
    @ApiOperation({ summary: 'Register a new admin user' })
    @ApiBody({ type: CreateUserDto, description: 'Admin user registration data' })
    @ApiCreatedResponse({ 
        description: 'Admin user has been successfully created',
        type: CreateUserDto 
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @HttpCode(HttpStatus.CREATED)
    //@Public()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('signup-admin')
    SignupAdmin(@Body() signupUser: SignupDto) {
        return this.authService.signupAdmin(signupUser, false);
    }


    // login
    @ApiOperation({ summary: 'Login with credentials' })
    @ApiBody({ type: LoginUserDto, description: 'User login credentials' })
    @ApiOkResponse({
        description: 'User has been successfully logged in',
        type: resultUserDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('login')
    Login(@Body() LoginUser: LoginUserDto, @Query('isMobile') isMobile: boolean = false) {
      return this.authService.login(LoginUser,isMobile);
    }



    // getr the profile info
    @ApiOperation({ summary: 'Get user profile' })
    @ApiOkResponse({
        description: 'Returns the user profile',
        type: CreateUserDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req: Request) {
      return req['user'];
    }

}
