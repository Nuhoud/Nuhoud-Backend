import { Module } from '@nestjs/common';
import { Minios3Service } from './minios3.service';
import { Minios3Controller } from './minios3.controller';

@Module({
  controllers: [Minios3Controller],
  providers: [Minios3Service],
})
export class Minios3Module {}
