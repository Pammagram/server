import { Mutation, Resolver } from '@nestjs/graphql';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { v4 as uuid } from 'uuid';

import { AuthService } from './auth.service';
import { VerifySmsInput, VerifySmsOutput } from './dto/verifySms';
import { Session } from './entities/session.entity';

import { Input, Ip, Request, Response } from '../common/decorators';

export const sessions: Session[] = [];

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

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
    const sessionId = uuid();

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
