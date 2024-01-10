import { Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { SESSION_ID } from './auth.constants';
import { AuthService } from './auth.service';
import { SendSmsInput, SendSmsOutput } from './dto';
import { VerifySmsInput, VerifySmsOutput } from './dto/verifySms';

import {
  Input,
  Ip,
  Request,
  Response,
  SignedCookies,
} from '../common/decorators';
import { SessionService } from '../session/session.service';
import { UserDto } from '../user/dto';
import { UserService } from '../user/user.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  @Query(() => UserDto)
  async me(@SignedCookies(SESSION_ID) sessionId: string): Promise<UserDto> {
    return this.sessionService.findUserBySessionId(sessionId);
  }

  @Mutation(() => SendSmsOutput)
  async sendSms(@Input() input: SendSmsInput): Promise<SendSmsOutput> {
    await this.authService.sendSms(input.phoneNumber);

    return {
      data: true,
    };
  }

  @Mutation(() => VerifySmsOutput)
  async verifySms(
    @Ip() ip: string,
    @Response() response: ExpressResponse,
    @Request() request: ExpressRequest,
    @Input() input: VerifySmsInput,
  ): Promise<VerifySmsOutput> {
    const { phoneNumber, code } = input;

    this.authService.verifySms(phoneNumber, code);

    const user = await this.userService.strictFindByPhoneNumber(phoneNumber);

    const { sessionId } = await this.sessionService.createSession({
      userAgent: request.headers['user-agent'],
      ip,
      user,
    });

    // TODO move sessionId to constants
    response.cookie(SESSION_ID, sessionId, {
      httpOnly: true,
      secure: true,
      signed: true,
    });

    return {
      data: user,
    };
  }

  @Mutation(() => Boolean)
  async logout(
    @Response() response: ExpressResponse,
    @SignedCookies(SESSION_ID) sessionId: string,
  ): Promise<boolean> {
    await this.sessionService.removeBySessionId(sessionId);

    response.cookie(SESSION_ID, null);

    return true;
  }
}
