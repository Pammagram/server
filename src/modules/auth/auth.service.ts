import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { SessionDto, VerifySmsInput } from './dto';
import { SessionEntity } from './entities';

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
  async createSession(
    data: Pick<SessionDto, 'ip' | 'userAgent'> & { phoneNumber: string },
  ): Promise<SessionEntity> {
    const { ip, phoneNumber, userAgent } = data;

    const sessionId = uuid();

    const user = await this.userService.strictFindByPhoneNumber(phoneNumber);

    // TODO connect user here
    const sessionData = {
      sessionId,
      user,
      active: false,
      lastVisitInMs: new Date(0),
      ip,
      userAgent,
    } satisfies Partial<SessionDto>;

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
