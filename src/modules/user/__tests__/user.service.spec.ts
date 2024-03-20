import { SessionService } from '@modules/session';
import { UserService } from '@modules/user/user.service';
import { TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { initUserServiceTestModule, UserRepositoryProvider } from './utils';

import { mockedUser } from '../__mocks__/user.entity.mock';
import { UserEntity } from '../entities';

describe('AuthService', () => {
  let userService: UserService;
  let testingModule: TestingModule;
  let usersRepository: Repository<UserEntity>;

  const userId = 1;
  const sessionId = 'test session id';

  beforeAll(async () => {
    const { module, service } = await initUserServiceTestModule();

    userService = service;
    testingModule = module;
    usersRepository = testingModule.get<Repository<UserEntity>>(
      UserRepositoryProvider,
    );
  });
  it('invokes user repository to create user', async () => {
    await userService.createUser(mockedUser);

    expect(usersRepository.save).toHaveBeenCalled();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('invokes user repository to find all users', async () => {
    await userService.findAll();

    expect(usersRepository.find).toHaveBeenCalled();
  });

  it('invokes user repository to find users by id', async () => {
    await userService.findByUserIds([userId]);

    expect(usersRepository.find).toHaveBeenCalled();
  });

  it('invokes user repository to find user or fail', async () => {
    await userService.findByUserIdOrFail(userId);

    expect(usersRepository.findOneOrFail).toHaveBeenCalled();
  });

  it('invokes user repository to find user by phone number', async () => {
    await userService.findByPhoneNumber('+38097777777');

    expect(usersRepository.findOne).toHaveBeenCalled();
  });

  it('invokes user repository to find user by phone number or fail', async () => {
    await userService.findByPhoneNumberOrFail('+38097777777');

    expect(usersRepository.findOneOrFail).toHaveBeenCalled();
  });
  it('invokes user repository to update user', async () => {
    await userService.updateByUserId(userId, {});

    expect(usersRepository.update).toHaveBeenCalled();
  });

  it('invokes user service to find user by session id or fail', async () => {
    const sessionService = testingModule.get<SessionService>(SessionService);

    await userService.findUserBySessionIdOrFail(sessionId);

    expect(sessionService.findBySessionByIdOrFail).toHaveBeenCalled();
  });

  // it('invokes user service to create user if not exist', async () => {
  //   const userService =
  //     testingModule.get<MockedUserServiceClass>(UserService);

  //   // * ensure that createUser has preconditions to be called
  //   jest
  //     .spyOn(userService, 'findByPhoneNumber')
  //     .mockImplementation(() => Promise.resolve(null));

  //   await authService.sendSms(phoneNumber);

  //   expect(userService.createUser).toHaveBeenCalled();
  // });

  // it('invokes messaging service to send sms', async () => {
  //   await authService.sendSms(phoneNumber);

  //   const messagingService =
  //     testingModule.get<MockedMessagingServiceClass>(MessagingService);

  //   expect(messagingService.sendVerificationCode).toHaveBeenCalledWith({
  //     phoneNumber,
  //   });
  // });
});
