import { Config } from '@config';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { entities } from './entities';

@Module({})
export class DbModule {
  static forRoot(): DynamicModule {
    return {
      module: DbModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService<Config>) => {
            const { host, name, password, port, username } =
              configService.getOrThrow('database', { infer: true });

            const isDevelopment = configService.getOrThrow(
              'app.isDevelopment',
              {
                infer: true,
              },
            );

            return {
              type: 'postgres',
              entities,
              synchronize: true,
              migrationsRun: isDevelopment,
              database: name,
              host,
              port,
              username,
              password,
            };
          },
        }),
      ],
    };
  }

  // * For testing purposes only
  static forTest(schemaName: string): DynamicModule {
    return {
      module: DbModule,
      providers: [ConfigService],
      exports: [ConfigService],
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: () => {
            return {
              type: 'postgres',
              synchronize: true,
              migrationsRun: true,
              entities,
              host: process.env.DATABASE_HOST,
              port: process.env.DATABASE_PORT,
              database: process.env.DATABASE_NAME,
              username: process.env.DATABASE_USERNAME,
              password: process.env.DATABASE_PASSWORD,
              schema: schemaName,
            };
          },
        }),
      ],
    };
  }
}
