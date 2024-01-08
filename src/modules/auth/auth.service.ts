import { Injectable } from '@nestjs/common';

import { VerifySmsInput, VerifySmsOutput } from './dto/verifySms';

@Injectable()
export class AuthService {
  verifySms(_input: VerifySmsInput): VerifySmsOutput {
    // TODO validate token here
    return {
      sessionId: 'test',
    };
  }
}
