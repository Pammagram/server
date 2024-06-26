import { SessionService } from '@modules/session/service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateUserInput, UserDto } from './dto';
import { UserEntity } from './entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
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

  async findByPhoneNumberOrFail(phoneNumber: string): Promise<UserDto> {
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

  async findUserBySessionIdOrFail(sessionId: string): Promise<UserDto> {
    const { user } =
      await this.sessionService.findBySessionByIdOrFail(sessionId);

    return user;
  }

  async findUsersByPhoneNumber(phoneNumbers: string[]): Promise<UserDto[]> {
    const users = await this.usersRepository.find({
      where: {
        phoneNumber: In(phoneNumbers),
      },
    });

    return users;
  }
}
