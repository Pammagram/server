import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import { ClearCookieParams, SetCookieParams } from './cookie.types';

@Injectable()
export class CookieService {
  setCookie(response: Response, params: SetCookieParams) {
    const { name, value, options } = params;

    response.cookie(name, value, {
      httpOnly: options?.isHttpOnly,
      secure: options?.isSecure,
      signed: options?.isSigned,
      expires: options?.expires,
    });
  }

  clearCookie(response: Response, params: ClearCookieParams) {
    const { name } = params;

    response.cookie(name, null);
  }
}
