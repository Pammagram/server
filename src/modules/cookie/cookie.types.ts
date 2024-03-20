export type SetCookieParamsOptions = {
  expires?: Date | undefined;
  isHttpOnly?: boolean | undefined;
  isSecure?: boolean | undefined;
  isSigned?: boolean | undefined;
};

export type SetCookieParams = {
  name: string;
  value: string | null;
  options?: SetCookieParamsOptions;
};

export type ClearCookieParams = Pick<SetCookieParams, 'name'>;
