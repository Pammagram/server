export const prettify = (data: unknown): string =>
  // eslint-disable-next-line no-magic-numbers -- spacing number
  JSON.stringify(data, null, 2);
