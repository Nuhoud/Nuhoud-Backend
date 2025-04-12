import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, 
            // apply auth guard to all routes
              {
                provide: APP_GUARD,
                useClass: AuthGuard,
              }
  ],
  // Export service to be used in other modules (AuthModule)
  exports: [UsersService], 
})
export class UsersModule {}
