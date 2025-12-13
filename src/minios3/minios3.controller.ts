import { Controller } from '@nestjs/common';
import { Minios3Service } from './minios3.service';

@Controller('minios3')
export class Minios3Controller {
  constructor(private readonly minios3Service: Minios3Service) {}
}
