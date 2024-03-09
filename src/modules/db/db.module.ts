import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_PROVIDER, ConfigType } from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [CONFIG_PROVIDER],
      useFactory: (configService: ConfigType) => {
        const { host, name, port, username, password } = configService.database;

        return {
          type: 'postgres',
          entities: ['dist/**/*.entity.js'],
          synchronize: true,
          migrationsRun: configService.app.isDevelopment,
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
