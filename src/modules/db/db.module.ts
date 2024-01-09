import { Global, Module } from '@nestjs/common';

import { databaseProviders } from './db.providers';

@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DbModule {}
