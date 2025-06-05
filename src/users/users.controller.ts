import { Controller, Get, Request, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Public } from 'src/public.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enums';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  // get all users
  @ApiOkResponse({ 
    description: 'Returns all users',
    type: CreateUserDto,
    isArray: true
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }


  // get user profile
  @ApiOkResponse({ 
    description: 'Returns a user profile',
    type: CreateUserDto
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('profile')
  async getProfile(@Request() req: Request): Promise<User> {
    //console.log(req)
    return this.usersService.findOne(req['user']._id);
  }

  // get user by id
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiOkResponse({ 
    description: 'Returns a user by ID',
    type: CreateUserDto
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  async findOne(@Param('id') id: string,@Request() req: Request): Promise<User> {
    //console.log(req)
    return this.usersService.findOne(id);
  }


  // update user by
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiBody({ type: UpdateUserDto, description: 'User data to update' })
  @ApiOkResponse({ description: 'Returns the updated user',type: CreateUserDto})
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id')
  async update(@Param('id') id: string,@Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }



  // delete user by id
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
