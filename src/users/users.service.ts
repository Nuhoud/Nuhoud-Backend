import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto, SignupEmployerDto } from '../auth/dto/signup-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: SignupDto, isVerified: boolean, role: string, isMobile: boolean): Promise<User> {
    try{
      const userData: CreateUserDto = {
        name: createUserDto.name,
        password: createUserDto.password,
      };
  
      if(isMobile){
        userData.mobile = createUserDto.identifier;
      }else{
        userData.email = createUserDto.identifier;
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
  
      // Create new user with hashed password
      const createdUser = new this.userModel({
        ...userData,
        password: hashedPassword,
        role: role,
        isVerified: isVerified,
        isFirstTime: role==="user"? true:false
      });
  
      return createdUser.save();
    }catch(error){
      if (error.code === 11000) {
        // Handle duplicate key error (unique constraint violation)
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictException(`User with this ${field} already exists`);
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async createEmployer(createUserDto: SignupEmployerDto): Promise<User>{
    try{
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      // Create new user with hashed password
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        role: 'employer',
        isVerified: true,
        isFirstTime: false
      });
      return createdUser.save();
    }catch(error){
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to find users');;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      console.log(id);
      const user = await this.userModel.findById(id).exec();
      
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid user ID format');
      }
      throw new InternalServerErrorException('Failed to find user');;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // First check if user exists
      const user = await this.findOne(id);
      
      // If password is provided, hash it
      let updateData = { ...updateUserDto };
      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      
      // Update the user and return the updated document
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
      
      return updatedUser as User;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid user ID format');
      }
      throw new InternalServerErrorException('Failed to update user');;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid user ID format');
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  // ymkn n7ntajha -- maybe in future needed
  async findByEmail(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }
  
  async findByMobile(mobile:string) :Promise<any> {
    const user = await this.userModel.findOne({mobile}).exec();
    return user;
  }

  async findByIdentifier(identifier: string,isMobile: boolean) :Promise<any> {
    const user = await this.userModel.findOne({ [isMobile ? 'mobile' : 'email']: identifier }).exec();
    return user;
  }

}
