import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RegisterInput } from './dto';
import { VerifySmsInput, VerifySmsOutput } from './dto/verifySms';
import { SessionEntity } from './entities/session.entity';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SESSION_REPOSITORY')
    private sessionRepository: Repository<SessionEntity>,
    private readonly userService: UserService,
  ) {}

  async register(input: RegisterInput): Promise<User> {
    const user = await this.userService.createUser(input);

    // TODO create session

    return user;
  }

  verifySms(_input: VerifySmsInput): VerifySmsOutput {
    // TODO validate token here
    return {
      sessionId: 'test',
    };
  }
}
