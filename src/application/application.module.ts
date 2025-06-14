import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { UsersModule } from '../users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports:[
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'nohoud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'nohoud-consumer',
          },
        },
      },
    ]),
    UsersModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
