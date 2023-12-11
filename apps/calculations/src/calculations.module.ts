import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { configValidationSchema } from '@app/common';
import { DbModule } from '@app/common';
import { CalculationsControllerV1 } from './calculations-v1.controller';
import { CalculationsService } from './calculations.service';
import { CalculationsRepository } from './calculations.repository';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
          autoLoadEntities: true,
        };
      },
      // dataSource receives the configured DataSourceOptions and returns a Promise<DataSource>.
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    DbModule,
  ],
  controllers: [CalculationsControllerV1],
  providers: [CalculationsService, CalculationsRepository],
})
export class CalculationsModule {}
