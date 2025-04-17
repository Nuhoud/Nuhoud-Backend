import { Body, Controller, Get, HttpCode, HttpStatus, Request, Post, UseGuards } from '@nestjs/common';
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



@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {

    constructor(private authService: AuthService) {}




    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: CreateUserDto, description: 'User registration data' })
    @ApiCreatedResponse({ 
        description: 'User has been successfully created',
        type: CreateUserDto 
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @HttpCode(HttpStatus.CREATED)
    @Public() // make the route public 
    @Post('signup')
    Signup(@Body() signupUser: CreateUserDto) {
        return this.authService.signup(signupUser);
    }

    

    @ApiOperation({ summary: 'Register a new admin user' })
    @ApiBody({ type: CreateUserDto, description: 'Admin user registration data' })
    @ApiCreatedResponse({ 
        description: 'Admin user has been successfully created',
        type: CreateUserDto 
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @HttpCode(HttpStatus.CREATED)
    //@Public() // make the route public 
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('signup-admin')
    SignupAdmin(@Body() signupUser: CreateUserDto) {
        return this.authService.signupAdmin(signupUser);
    }



    @ApiOperation({ summary: 'Login with credentials' })
    @ApiBody({ type: LoginUserDto, description: 'User login credentials' })
    @ApiOkResponse({
        description: 'User has been successfully logged in',
        type: resultUserDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(HttpStatus.OK)
    @Public() // make the route public 
    @Post('login')
    Login(@Body() LoginUser: LoginUserDto) {
      return this.authService.login(LoginUser);
    }



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
