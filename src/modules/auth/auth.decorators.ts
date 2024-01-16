import { SESSION_ID } from './auth.constants';

import { SignedCookies } from '../common/decorators';

export const SessionId = SignedCookies.bind(
  SignedCookies,
  SESSION_ID,
) as typeof SignedCookies;
