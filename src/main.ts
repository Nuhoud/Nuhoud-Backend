import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalPipes } from './config/global-pipes';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ تفعيل البايبس العامة
  app.useGlobalPipes(...GlobalPipes);

  // ✅ تفعيل Swagger
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
