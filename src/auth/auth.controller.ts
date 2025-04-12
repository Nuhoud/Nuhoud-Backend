import { Body, Controller, Get, HttpCode, HttpStatus,Request , Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/public.decorator';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { sign } from 'crypto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiBearerAuth()
@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
    constructor(private authService: AuthService) {}


    @ApiOkResponse({type: CreateUserDto})
    @HttpCode(HttpStatus.CREATED)
    @Public() // make the route public 
    @Post('signup')
    Signup(@Body() signupUser: CreateUserDto) {
        return this.authService.signup(signupUser);
    }
    
    @ApiOkResponse({type: LoginUserDto})
    @HttpCode(HttpStatus.OK)
    @Public() // make the route public 
    @Post('login')
    Login(@Body() LoginUser: LoginUserDto) {
      return this.authService.login(LoginUser);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req: Request) {
      return req['user'];
    }

}
