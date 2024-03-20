import { Config } from '@config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        const { host, name, password, port, username } =
          configService.getOrThrow('database', { infer: true });

        const isDevelopment = configService.getOrThrow('app.isDevelopment', {
          infer: true,
        });

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
})
export class DbModule {}
