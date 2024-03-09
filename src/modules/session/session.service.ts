import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { SessionDto } from './dto';
import { SessionEntity } from './entities';

import { UserEntity } from '../user/entities';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  async findByUserId(userId: number): Promise<SessionDto[]> {
    return this.sessionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async createSession(
    data: Pick<SessionDto, 'ip' | 'userAgent'> & {
      user: UserEntity;
      rememberMe?: boolean;
    },
  ): Promise<SessionEntity> {
    const { ip, userAgent, user } = data;

    const sessionId = uuid();

    const sessionData = {
      sessionId,
      user,
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
      relations: {
        user: true,
      },
    });
  }

  findBySessionIdOrFail(sessionId: string): Promise<SessionEntity> {
    return this.sessionRepository.findOneOrFail({
      where: {
        sessionId,
      },
      relations: {
        user: true,
      },
    });
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
