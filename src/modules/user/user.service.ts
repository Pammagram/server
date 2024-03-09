import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateUserInput, UserDto } from './dto';
import { UserEntity } from './entities';

import { SessionService } from '../session/session.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly sessionService: SessionService,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  findByUserIds(userIds: number[]): Promise<UserEntity[]> {
    return this.usersRepository.find({
      where: {
        id: In(userIds),
      },
    });
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

  async findUserBySessionId(sessionId: string): Promise<UserDto> {
    const { user } = await this.sessionService.findBySessionId(sessionId);

    return user;
  }
}
