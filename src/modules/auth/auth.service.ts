import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { VerifySmsInput, VerifySmsOutput } from './dto/verifySms';
import { SessionEntity } from './entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SESSION_REPOSITORY')
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  verifySms(_input: VerifySmsInput): VerifySmsOutput {
    // TODO validate token here
    return {
      sessionId: 'test',
    };
  }
}
