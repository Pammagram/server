import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  setCookie(response: Response, params: SetCookieParams) {
    const { options, name, value } = params;
    const { expires, isHttpOnly, isSecure, isSigned } = options;

    response.cookie(name, value, {
      httpOnly: isHttpOnly,
      secure: isSecure,
      signed: isSigned,
      expires,
    });
  }
}

type SetCookieParams = {
  name: string;
  options: {
    expires: Date;
    isHttpOnly: boolean;
    isSecure: boolean;
    isSigned: boolean;
  };

  value: string;
};
