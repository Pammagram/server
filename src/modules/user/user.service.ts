import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateUserInput, UserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findByPhoneNumber(phoneNumber: string): Promise<UserDto | null> {
    return this.usersRepository.findOne({
      where: {
        phoneNumber,
      },
    });
  }

  findBySessionId(_sessionId: string): Promise<UserDto | null> {
    // TODO implement when merged with session relations

    throw new Error();
    // return this.usersRepository.findOne({
    //   where: {
    //     phoneNumber,
    //   },
    // });
  }

  strictFindBySessionId(_sessionId: string): Promise<UserDto> {
    // TODO implement when merged with session relations

    throw new Error();
    // return this.usersRepository.findOne({
    //   where: {
    //     phoneNumber,
    //   },
    // });
  }

  async strictFindByPhoneNumber(phoneNumber: string): Promise<UserDto> {
    const user = await this.usersRepository.findOneOrFail({
      where: {
        phoneNumber,
      },
    });

    return user;
  }

  createUser(input: CreateUserInput): Promise<User> {
    return this.usersRepository.save(input);
  }

  // async getUserBySessionId(sessionId: string): Promise<User> {
  //   const session = await this.sessionsRepository.findOne({
  //     where: {
  //       sessionId,
  //     },
  //   });
  // }
}
