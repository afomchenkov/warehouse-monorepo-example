import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WarehousesModule } from './warehouses.module';

async function bootstrap() {
  const app = await NestFactory.create(WarehousesModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.enableCors({ credentials: true, origin: '*' }); // for prod whitelist only allowed domains
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
