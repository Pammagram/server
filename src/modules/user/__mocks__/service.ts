import { CreateUserInput, UserDto } from '@modules/user/dto';
import { User, UserEntity } from '@modules/user/entities';
import { UserService } from '@modules/user/user.service';
import { Provider } from '@nestjs/common';

const user: User = {
  chats: [],
  id: 0,
  lastActiveInMs: new Date(),
  phoneNumber: '',
  sessions: [],
  username: 'test',
};

// @ts-expect-error -- ts expects private fields to be defined
class MockedUserServiceClass implements UserService {
  createUser(_input: CreateUserInput): Promise<UserDto> {
    return Promise.resolve(user);
  }

  findAll(): Promise<UserEntity[]> {
    return Promise.resolve([user]);
  }

  findByPhoneNumber = (_phoneNumber) => Promise.resolve(user);

  findByUserIdOrFail = (_userId) => Promise.resolve(user);

  findByUserIds = (_userIds) => Promise.resolve([user]);

  findUserBySessionId = (_sessionId) => Promise.resolve(user);

  strictFindByPhoneNumber = (_phoneNumber: string) => Promise.resolve(user);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- ts limitations
  updateByUserId = (_userId, _data) => Promise.resolve(true) as Promise<true>;
}

export const MockedUserService: Provider = {
  useClass: MockedUserServiceClass,
  provide: UserService,
};
