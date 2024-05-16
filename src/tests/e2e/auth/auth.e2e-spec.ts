import { INestApplication } from '@nestjs/common';
import { SESSION_ID } from '@root/modules/auth/constants';
import {
  LogoutOutput,
  SendSmsOutput,
  VerifySmsOutput,
} from '@root/modules/auth/dto';
import { MockedMessagingServiceClass } from '@root/modules/messaging/__mocks__/messaging.service.mock';
import { MessagingService } from '@root/modules/messaging/messaging.service';
import { parse } from 'set-cookie-parser';
import gqlRequest from 'supertest-graphql';

import { createLogoutMutation } from './mutations/logout';
import { createSendSmsMutation } from './mutations/sendSms';
import { createVerifySmsMutation } from './mutations/verifySms';

import { initializeApp } from '../utils/bootstrap';

describe('Authentication flow', () => {
  let app: INestApplication;
  let messagingService: MockedMessagingServiceClass;

  beforeAll(async () => {
    app = await initializeApp();
    messagingService = app.get<MockedMessagingServiceClass>(MessagingService);
  });

  it('Signs in with right code', async () => {
    await gqlRequest<{ sendSms: SendSmsOutput }>(app.getHttpServer()).mutate(
      createSendSmsMutation(),
    );

    const { data } = await gqlRequest<{ verifySms: VerifySmsOutput }>(
      app.getHttpServer(),
    )
      .mutate(createVerifySmsMutation(messagingService.getVerificationCode()))
      .expectNoErrors();

    expect(data?.verifySms.data.id).toBeDefined();
  });

  it('Sign in fails with wrong code', async () => {
    const server = app.getHttpServer();

    await gqlRequest<{ sendSms: SendSmsOutput }>(server)
      .mutate(createSendSmsMutation())
      .expectNoErrors();

    const verificationCode = `${messagingService.getVerificationCode()}wrongCode`;

    const { errors } = await gqlRequest<{ verifySms: VerifySmsOutput }>(
      server,
    ).mutate(createVerifySmsMutation(verificationCode));

    expect(errors?.length).toBeGreaterThan(0);
  });

  it('Logs out successfully', async () => {
    const server = app.getHttpServer();

    await gqlRequest<{ sendSms: SendSmsOutput }>(server)
      .mutate(createSendSmsMutation())
      .expectNoErrors();

    const verificationCode = messagingService.getVerificationCode();

    const { response } = await gqlRequest<{ verifySms: VerifySmsOutput }>(
      server,
    )
      .mutate(createVerifySmsMutation(verificationCode))
      .expectNoErrors();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any -- types mismatch from supertest
    const cookies = parse(response as any, { map: true });

    const sessionId = cookies[SESSION_ID]?.value;

    const { data } = await gqlRequest<{ logout: LogoutOutput }>(server)
      .mutate(createLogoutMutation())
      .set('Cookie', [`${SESSION_ID}=${sessionId}`])
      .expectNoErrors();

    expect(data).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
