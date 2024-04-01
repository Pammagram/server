import { Config } from '@config';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
              entities: ['dist/**/*.entity.js'],
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
              migrationsRun: false,
              database: 'postgres',
              host: 'localhost',
              port: 5432,
              schema: schemaName,
              username: 'postgres',
              password: 'postgres',
            };
          },
        }),
      ],
    };
  }
}
