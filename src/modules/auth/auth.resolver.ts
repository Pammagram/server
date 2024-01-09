import { Mutation, Resolver } from '@nestjs/graphql';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

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
import { UserService } from '../user/user.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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
    const { phoneNumber } = input;

    await this.authService.verifySms(input);

    const { sessionId } = await this.authService.createSession({
      userAgent: request.headers['user-agent'],
      ip,
      phoneNumber,
    });

    // TODO move sessionId to constants
    response.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: true,
      signed: true,
    });

    const user = await this.userService.strictFindByPhoneNumber(phoneNumber);

    return {
      data: user,
    };
  }

  @Mutation(() => Boolean)
  async logout(
    @Response() response: ExpressResponse,
    @SignedCookies('sessionId') sessionId: string,
  ): Promise<boolean> {
    await this.authService.removeSession(sessionId);

    response.cookie('sessionId', null);

    return true;
  }
}
