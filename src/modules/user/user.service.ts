import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateUserInput } from './dto';
import { User } from './entities';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<User>,
    // @Inject('SESSION_REPOSITORY')
    // private readonly sessionsRepository: Repository<Session>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
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
