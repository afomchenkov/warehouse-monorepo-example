import { NestFactory } from '@nestjs/core';
import { CalculationsModule } from './calculations.module';

async function bootstrap() {
  const app = await NestFactory.create(CalculationsModule);
  await app.listen(3000);
}
bootstrap();
