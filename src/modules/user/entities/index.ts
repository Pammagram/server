import { DataSource } from 'typeorm';

import { UserEntity } from './user.entity';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    inject: ['DATA_SOURCE'],
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
  },
];

export * from './user.entity';
