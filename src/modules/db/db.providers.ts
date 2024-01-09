import { DataSource } from 'typeorm';

import { CONFIG_PROVIDER, ConfigType } from '../../config';

// * For migrations only
// TODO make better
export const migrationDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost', // * if run in docker, should be name of container
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: ['dist/**/*.entity.js'],
  migrationsRun: process.env.NODE_ENV === 'development',
  synchronize: true,
});

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [CONFIG_PROVIDER],
    useFactory: async (configService: ConfigType) => {
      const { host, name, port, username, password } = configService.database;

      const dataSource = new DataSource({
        type: 'postgres',
        host, // * if run in docker, should be name of container
        port,
        username,
        password,
        database: name,
        entities: ['dist/**/*.entity.js'],
        synchronize: true,
        migrationsRun: process.env.NODE_ENV === 'development',
      });

      return dataSource.initialize();
    },
  },
];
