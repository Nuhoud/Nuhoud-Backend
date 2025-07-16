import { Module } from '@nestjs/common';
import { AiserviceService } from './aiservice.service';
import { AiserviceController } from './aiservice.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Devplan, DevplanSchema } from './entities/devplan,entity';
import { SkillsRecommendation, SkillsRecommendationSchema } from './entities/skillsrecommendation.entity';


@Module({
  imports: [HttpModule,
    MongooseModule.forFeature([
      { name: Devplan.name, schema: DevplanSchema },
      { name: SkillsRecommendation.name, schema: SkillsRecommendationSchema },
    ]),
  ],
  controllers: [AiserviceController],
  providers: [AiserviceService],
  exports: [AiserviceService],
})
export class AiserviceModule {}
