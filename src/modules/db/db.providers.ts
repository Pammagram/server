import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'database', // * if run in docker, should be name of container
        port: 5432, // TODO from config
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        entities: [`${__dirname}/../**/*.entity.ts`],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
