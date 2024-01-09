import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateUserInput } from './dto';
import { UserEntity } from './entities';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<UserEntity>,
    // @Inject('SESSION_REPOSITORY')
    // private readonly sessionsRepository: Repository<Session>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  createUser(input: CreateUserInput): Promise<UserEntity> {
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
