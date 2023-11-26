import { NestFactory } from '@nestjs/core';
import { WarehousesModule } from './warehouses.module';

async function bootstrap() {
  const app = await NestFactory.create(WarehousesModule);
  await app.listen(3000);
}
bootstrap();
