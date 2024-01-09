import { CONFIG_PROVIDER, ConfigType } from 'src/config';
import { DataSource } from 'typeorm';

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
        entities: [`${__dirname}/../**/*.entity.ts`],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
