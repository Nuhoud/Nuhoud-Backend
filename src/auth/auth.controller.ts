import { Body, Controller, Get, HttpCode,Request, HttpStatus, Post, UseGuards, Query, ParseBoolPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles/roles.guard'
import { Public } from 'src/public.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Role } from './enums/role.enums';
import { Roles } from './decorators/roles.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { SignupDto } from './dto/signup-auth.dto';
import { ResetPasswordDto } from './dto/resetPassword-auth.dto';
import { RequestResetPasswordDto } from './dto/requestResetPassword-auth.dto';

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
    async Signup(@Body() signupUser: SignupDto, @Query('isMobile', ParseBoolPipe) isMobile: boolean = false) {
        return this.authService.signup(signupUser, isMobile);
    }


    // verify-otp
    @ApiOperation({ summary: 'Verify OTP for user registration' })
    @ApiBody({ type: VerifyOtpDto, description: 'OTP verification data' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('verify-otp')
    async vefifySignup(@Body() verifyOtp: VerifyOtpDto, @Query('isMobile', ParseBoolPipe) isMobile: boolean  = false) {
        return this.authService.verifyOtp(verifyOtp, isMobile);
    }


    // resend-otp
    @ApiOperation({ summary: 'Resend OTP for user registration' })
    @ApiBody({ type: ResendOtpDto, description: 'Resend OTP data' })
    @ApiOkResponse({
        description: 'OTP has been successfully resent',
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('resend-otp')
    async resendOTP(@Body() resendOtp: ResendOtpDto, @Query('isMobile', ParseBoolPipe) isMobile: boolean  = false) {
        return this.authService.resendOtp(resendOtp, isMobile);
    }


    // requestResetPassword
    @ApiOperation({ summary: 'Request password reset' })
    @ApiBody({ type: RequestResetPasswordDto, description: 'Password reset data' })
    @Public()
    @Post('requestResetPassword')
    async requestResetPassword(@Body() requestResetPasswordDto: RequestResetPasswordDto, @Query('isMobile', ParseBoolPipe) isMobile: boolean  = false){
        return this.authService.requestPasswordReset(requestResetPasswordDto.identifier,isMobile);
    }

    // verify ResetPassword Otp
    @ApiOperation({ summary: 'Verify OTP for reset password' })
    @ApiBody({ type: VerifyOtpDto, description: 'OTP verification data' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('verifyResetPasswordOtp')
    async verifyResetPasswordOtp(@Body() verifyResetPasswordDto: VerifyOtpDto, @Query('isMobile', ParseBoolPipe) isMobile: boolean  = false){
        return this.authService.verifyOtp(verifyResetPasswordDto,isMobile);
    }

    // resetPassword
    @ApiOperation({ summary: 'Reset password' })
    @ApiBody({ type: ResetPasswordDto, description: 'Password reset data' })
    @UseGuards(AuthGuard)
    @Post('resetPassword')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Query('isMobile', ParseBoolPipe) isMobile: boolean  = false){
        return this.authService.resetPassword(resetPasswordDto,isMobile);
    }
    
    // signup admin
    @ApiOperation({ summary: 'Register a new admin user' })
    @ApiBody({ type: SignupDto, description: 'Admin user registration data' })
    @ApiCreatedResponse({ 
        description: 'Admin user has been successfully created',
        type: SignupDto 
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @HttpCode(HttpStatus.CREATED)
    //@Public()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('signup-admin')
    async SignupAdmin(@Body() signupUser: SignupDto) {
        return this.authService.signupAdmin(signupUser, false);
    }


    // login
    @ApiOperation({ summary: 'Login with credentials' })
    @ApiBody({ type: LoginUserDto, description: 'User login credentials' })
    @ApiOkResponse({
        description: 'User has been successfully logged in, Returns the jwt token',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('login')
    async Login(@Body() LoginUser: LoginUserDto, @Query('isMobile', ParseBoolPipe) isMobile: boolean = false) {
      return this.authService.login(LoginUser,isMobile);
    }



}
