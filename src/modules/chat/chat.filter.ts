import { MessageAddedPayload } from './dto';

import { GqlContext } from '../common/decorators';

// * when moving keep in mind mocking at ./server/src/tests/e2e/chat/subscriptions.e2e-spec.ts
export const messageAddedFilter = (
  payload: MessageAddedPayload,
  _variables: Record<string, unknown>,
  context: GqlContext,
) => {
  const {
    messageAdded: { data },
  } = payload;

  const {
    chat: { members },
  } = data;

  const userId = context.extra?.session?.user.id;

  if (members.some((member) => member.id === userId)) {
    return true;
  }

  return false;
};
