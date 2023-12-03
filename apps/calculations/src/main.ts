import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { CalculationsModule } from './calculations.module';

async function bootstrap() {
  const app = await NestFactory.create(CalculationsModule);
  // the REST endpoints are versioned by header
  // https://stackoverflow.com/questions/18905335/rest-versioning-url-vs-header
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Service-Version',
    defaultVersion: '1',
  });

  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.enableCors({ credentials: true, origin: '*' }); // for prod whitelist only allowed domains
  await app.listen(configService.get('PORT') || 3001);
}
bootstrap();
