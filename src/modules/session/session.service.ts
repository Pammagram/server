import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { SessionDto } from './dto';
import { SessionEntity } from './entities';

import { UserDto } from '../user/dto';
import { UserEntity } from '../user/entities';

@Injectable()
export class SessionService {
  constructor(
    @Inject('SESSION_REPOSITORY')
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  async createSession(
    data: Pick<SessionDto, 'ip' | 'userAgent'> & { user: UserEntity },
  ): Promise<SessionEntity> {
    const { ip, userAgent, user } = data;

    // TODO encrypt it when storing to db
    const sessionId = uuid();

    const sessionData = {
      sessionId,
      user,
      active: false,
      ip,
      userAgent,
    } satisfies Partial<SessionDto>;

    return this.sessionRepository.save(sessionData);
  }

  removeBySessionId(sessionId: string) {
    return this.sessionRepository.delete({
      sessionId,
    });
  }

  findBySessionId(sessionId: string): Promise<SessionEntity | null> {
    return this.sessionRepository.findOne({
      where: {
        sessionId,
      },
    });
  }

  async findUserBySessionId(sessionId: string): Promise<UserDto | null> {
    const { user } = await this.sessionRepository.findOne({
      where: {
        sessionId,
      },
      relations: {
        user: true,
      },
    });

    return user;
  }

  async updateBySessionId(
    sessionId: string,
    data: Partial<Omit<SessionEntity, 'id'>>,
  ): Promise<boolean> {
    await this.sessionRepository.update(
      {
        sessionId,
      },
      data,
    );

    return true;
  }
}
