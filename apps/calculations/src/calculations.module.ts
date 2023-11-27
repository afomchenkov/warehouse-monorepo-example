import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculationsController } from './calculations.controller';
import { CalculationsService } from './calculations.service';
import { configValidationSchema } from '@app/common';
import { DbModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`stage.${process.env.NODE_ENV}.env`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
        };
      },
    }),
    DbModule,
  ],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}
