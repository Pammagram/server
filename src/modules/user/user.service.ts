import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateUserInput, UserDto } from './dto';
import { UserEntity } from './entities';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  findByUserIdOrFail(userId: number): Promise<UserEntity> {
    return this.usersRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });
  }

  findByPhoneNumber(phoneNumber: string): Promise<UserDto | null> {
    return this.usersRepository.findOne({
      where: {
        phoneNumber,
      },
    });
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

  createUser(input: CreateUserInput): Promise<UserDto> {
    return this.usersRepository.save(input);
  }

  async updateByUserId(userId: number, data: Partial<UserDto>): Promise<true> {
    await this.usersRepository.update(userId, data);

    return true;
  }

  // async getUserBySessionId(sessionId: string): Promise<User> {
  //   const session = await this.sessionsRepository.findOne({
  //     where: {
  //       sessionId,
  //     },
  //   });
  // }
}
