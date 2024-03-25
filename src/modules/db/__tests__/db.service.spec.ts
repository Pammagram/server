import { beforeEach, describe } from '@jest/globals';
import { createNewSchema, dropSchema } from '@modules/db/__tests__/utils';
import { DbModule } from '@modules/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

describe('Database service', () => {
  let schemaName: string;
  let module: TestingModule;

  beforeEach(async () => {
    const { schema } = await createNewSchema();

    schemaName = schema;

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DbModule.forTest(schemaName),
      ],
    }).compile();
  });

  afterEach(async () => {
    await dropSchema(schemaName);

    await module.close();
  });

  it('Connects to newly created schema', async () => {
    // it works
  });
});
