import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { VerifySmsInput } from './dto/verifySms';
import { Session, SessionEntity } from './entities/session.entity';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SESSION_REPOSITORY')
    private sessionRepository: Repository<SessionEntity>,
    private readonly userService: UserService,
  ) {}

  async verifySms(_input: VerifySmsInput): Promise<boolean> {
    await new Promise<void>((res) => {
      res();
    });

    // TODO throw error if code is invalid
    return true;
  }

  // TODO cleanup of unutilized users
  async sendSms(phoneNumber: string): Promise<true> {
    let user = await this.userService.findByPhoneNumber(phoneNumber);

    if (!user) {
      user = await this.userService.createUser({
        phoneNumber,
        username: null,
      });
    }

    await this.sendOtp(phoneNumber);

    return true;
  }

  // TODO
  async sendOtp(_phoneNumber: string): Promise<boolean> {
    await new Promise<void>((res) => {
      res();
    });

    return true;
  }

  // TODO move to session sub module in future
  createSession(
    data: Pick<Session, 'ip' | 'userAgent'>,
  ): Promise<SessionEntity> {
    // TODO use some randomize here
    // eslint-disable-next-line no-magic-numbers -- temporary solution
    const sessionId = Math.random().toString(36);

    const sessionData: Session = {
      ...data,
      sessionId,
      active: false,
      lastVisitInMs: new Date(0),
    };

    return this.sessionRepository.save(sessionData);
  }

  removeSession(sessionId: string) {
    return this.sessionRepository.delete({
      sessionId,
    });
  }

  findSessionById(sessionId: string): Promise<SessionEntity | null> {
    return this.sessionRepository.findOne({
      where: {
        sessionId,
      },
    });
  }

  async updateSessionById(
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
