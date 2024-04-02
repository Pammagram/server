import { config, configValidationSchema } from '@config';
import { beforeEach, describe } from '@jest/globals';
import { DbModule } from '@modules/db/db.module';
import { SessionModule } from '@modules/session';
import { UserModule } from '@modules/user/user.module';
import { UserService } from '@modules/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { createNewSchema, dropSchema } from '../utils';

describe('User service', () => {
  let schemaName: string;
  let module: TestingModule;
  let service: UserService;

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
          UserModule,
          SessionModule,
        ],
      }).compile();
    } catch (error) {
      console.error(error);
      // * if initialization goes wrong - remove created schema
      await dropSchema(schemaName);
    }

    service = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    await dropSchema(schemaName);

    await module.close();
  });

  it('Fetches empty list of users at start', async () => {
    const users = await service.findAll();

    expect(users).toHaveLength(0);
  });
  it('Creates one user', async () => {
    const users = await service.findAll();

    expect(users).toHaveLength(0);

    const mockUserData = {
      phoneNumber: 'testPhoneNumber',
      username: 'testUsername',
    };

    await service.createUser(mockUserData);

    const newUsers = await service.findAll();

    expect(newUsers.length).toBe(1);

    expect(newUsers[0]).toMatchObject(mockUserData);
  });
});
