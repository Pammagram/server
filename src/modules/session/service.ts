import { prettify } from '@core/utils/prettify';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { SessionDto } from './dto';
import { SessionEntity } from './entities';

import { UserEntity } from '../user/entities';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  async findByUserId(userId: number): Promise<SessionDto[]> {
    const sessions = await this.sessionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    this.logger.debug(`sessions for user ${userId}`, sessions);

    return sessions;
  }

  async findMessagingTokensByUserIds(
    userIds: number[],
  ): Promise<Pick<SessionDto, 'messagingToken'>[]> {
    const sessions = await this.sessionRepository.find({
      where: {
        user: {
          id: In(userIds),
        },
      },
      select: {
        messagingToken: true,
      },
    });

    this.logger.debug(`sessions for user ${prettify(userIds)}`, sessions);

    return sessions;
  }

  async findByIdOrFail(id: number): Promise<SessionDto> {
    return this.sessionRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async createSession(
    data: Pick<SessionDto, 'ip' | 'device' | 'messagingToken'> & {
      user: UserEntity;
      rememberMe?: boolean;
    },
  ): Promise<SessionEntity> {
    const sessionData = {
      ...data,
      sessionId: uuid(),
    } satisfies Partial<SessionDto>;

    const newSession = await this.sessionRepository.save(sessionData);

    this.logger.debug('session created', newSession);

    return newSession;
  }

  removeBySessionId(sessionId: string) {
    return this.sessionRepository.delete({
      sessionId,
    });
  }

  async removeById(id: number): Promise<SessionEntity> {
    const sessionToDelete = await this.findByIdOrFail(id);

    await this.sessionRepository.delete({
      id,
    });

    return sessionToDelete;
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

  findBySessionByIdOrFail(sessionId: string): Promise<SessionEntity> {
    return this.sessionRepository.findOneOrFail({
      where: {
        sessionId,
      },
      relations: {
        user: true,
      },
    });
  }

  async findSessionBySessionIdOrFailAndUpdate(
    sessionId: string,
  ): Promise<SessionEntity> {
    await this.sessionRepository.update(
      {
        sessionId,
      },
      {
        lastVisitInMs: new Date(),
      },
    );

    return this.findBySessionByIdOrFail(sessionId);
  }

  async updateById(
    id: number,
    data: Partial<Omit<SessionEntity, 'id'>>,
  ): Promise<boolean> {
    this.logger.debug('session id', id);
    this.logger.debug('data', data);

    await this.sessionRepository.update({ id }, data);

    return true;
  }
}
