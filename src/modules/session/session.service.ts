import { Inject, Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { ConfigType } from 'src/config';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { SessionDto } from './dto';
import { SessionEntity } from './entities';

import { Config } from '../common/decorators';
import { UserDto } from '../user/dto';
import { UserEntity } from '../user/entities';

@Injectable()
export class SessionService {
  private readonly config: ConfigType['auth'];

  constructor(
    @Config()
    configService: ConfigType,
    @Inject('SESSION_REPOSITORY')
    private sessionRepository: Repository<SessionEntity>,
  ) {
    this.config = configService.auth;
  }

  async createSession(
    data: Pick<SessionDto, 'ip' | 'userAgent'> & {
      user: UserEntity;
      rememberMe?: boolean;
    },
  ): Promise<SessionEntity> {
    const { ip, userAgent, user } = data;

    const sessionId = uuid();

    const { saltRounds } = this.config;
    const salt = await genSalt(saltRounds);

    const sessionIdEncrypted = await hash(sessionId, salt);

    const sessionData = {
      sessionId: sessionIdEncrypted,
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

  async findUserBySessionIdOrFail(sessionId: string): Promise<UserDto | null> {
    const { user } = await this.sessionRepository.findOneOrFail({
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
