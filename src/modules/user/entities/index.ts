import { DataSource } from 'typeorm';

import { User } from './user.entity';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    inject: ['DATA_SOURCE'],
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  },
];
