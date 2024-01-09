import { Mutation, Resolver } from '@nestjs/graphql';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { AuthService } from './auth.service';
import { RegisterInput, RegisterOutput } from './dto';
import { VerifySmsInput, VerifySmsOutput } from './dto/verifySms';
import { Session } from './entities/session.entity';

import { Input, Ip, Request, Response } from '../common/decorators';

// TODO connect to db
export const sessions: Session[] = [];

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterOutput)
  async register(@Input() input: RegisterInput): Promise<RegisterOutput> {
    const user = await this.authService.register(input);

    return {
      data: user,
    };
  }

  @Mutation(() => Boolean)
  sendSms(): true {
    return true;
  }

  // ? TODO return user on successful login
  @Mutation(() => VerifySmsOutput)
  verifySms(
    @Ip() ip: string,
    @Response() response: ExpressResponse,
    @Request() request: ExpressRequest,
    @Input() input: VerifySmsInput,
  ): VerifySmsOutput {
    // const {} = input;
    // eslint-disable-next-line no-magic-numbers
    const sessionId = Math.random().toString(36);

    const sessionData: Session = {
      active: true,
      ip,
      lastVisitInMs: Date.now(),
      sessionId,
      userAgent: request.headers['user-agent'],
    };

    sessions.push(sessionData);

    console.debug('sessions', sessions);

    // TODO to constants
    response.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: true,
      signed: true,
    });

    return this.authService.verifySms(input);
  }

  @Mutation(() => Boolean)
  resendSms(): true {
    return true;
  }
}
