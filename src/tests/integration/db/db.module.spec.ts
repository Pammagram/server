import { config, configValidationSchema } from '@config';
import { beforeEach, describe } from '@jest/globals';
import { DbModule } from '@modules/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { createNewSchema, dropSchema } from '../utils';

describe('Database service', () => {
  let schemaName: string;
  let module: TestingModule;

  beforeEach(async () => {
    // TODO can abstract away creating testing module
    const { schema } = await createNewSchema();

    schemaName = schema;

    try {
      module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validationSchema: configValidationSchema,
          }),
          DbModule.forTest(schemaName),
        ],
      }).compile();
    } catch (error) {
      // * if initialization goes wrong - remove created schema
      await dropSchema(schemaName);
    }
  });

  afterEach(async () => {
    await dropSchema(schemaName);

    await module.close();
  });

  it('Connects to newly created schema', async () => {
    // if no error then module is initialized and connection is established
  });
});
