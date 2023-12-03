import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { configValidationSchema } from '@app/common';
import { DbModule } from '@app/common';

import { WarehousesService } from './services';
import {
  ProductRepository,
  CustomerRepository,
  WarehouseRepository,
} from './repositories';
import {
  CustomerResolver,
  ProductResolver,
  WarehouseResolver,
} from './resolvers';

import { WarehousesController } from './warehouses.controller';
import { GraphqlExceptionsFilter } from './graphql-exceptions.filter';

// GraphQL API served at: http://localhost:3000/graphql

@Module({
  imports: [
    // set up GraphQL module
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      path: 'graphql',
    }),
    // set up server inbuilt cache control
    CacheModule.register({
      ttl: 7200, // 2hr in seconds
      max: 1000, // maximum number of items in cache
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
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
          synchronize: true,
        };
      },
    }),
    DbModule,
  ],
  controllers: [WarehousesController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GraphqlExceptionsFilter,
    },
    CustomerResolver,
    CustomerRepository,
    ProductResolver,
    ProductRepository,
    WarehouseResolver,
    WarehouseRepository,
    WarehousesService,
  ],
})
export class WarehousesModule {}
