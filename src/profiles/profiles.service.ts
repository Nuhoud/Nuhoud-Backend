import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';


@Injectable()
export class ProfilesService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ){}

    
  

}
