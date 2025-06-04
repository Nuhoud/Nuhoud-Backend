import { Controller } from '@nestjs/common';
import { AiserviceService } from './aiservice.service';

@Controller('aiservice')
export class AiserviceController {
  constructor(private readonly aiserviceService: AiserviceService) {}


  

}
