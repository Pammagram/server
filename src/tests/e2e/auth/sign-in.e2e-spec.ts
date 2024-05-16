import { INestApplication } from '@nestjs/common';
import { SendSmsOutput, VerifySmsOutput } from '@root/modules/auth/dto';
import { MockedMessagingServiceClass } from '@root/modules/messaging/__mocks__/messaging.service.mock';
import { MessagingService } from '@root/modules/messaging/messaging.service';
import gql from 'graphql-tag';
import gqlRequest from 'supertest-graphql';

import { initializeApp } from '../utils/bootstrap';

describe('Sign in flow', () => {
  let app: INestApplication;
  let messagingService: MockedMessagingServiceClass;

  beforeAll(async () => {
    app = await initializeApp();
    messagingService = app.get<MockedMessagingServiceClass>(MessagingService);
  });

  it('Signs in with right code', async () => {
    await gqlRequest<{ sendSms: SendSmsOutput }>(app.getHttpServer()).mutate(
      gql`
        mutation SendSms {
          sendSms(input: { phoneNumber: "1234" }) {
            data
          }
        }
      `,
    );

    const verificationCode = messagingService.getVerificationCode();

    const { data } = await gqlRequest<{ verifySms: VerifySmsOutput }>(
      app.getHttpServer(),
    )
      .mutate(
        gql`
      mutation SendSms {
        verifySms(input: { phoneNumber: "1234", code: "${verificationCode}", device: "test" }) {
          data {
            id
          }
        }
      }
    `,
      )
      .expectNoErrors();

    expect(data?.verifySms.data.id).toBeDefined();
  });

  it('Sign in fails with wrong code', async () => {
    const server = app.getHttpServer();

    await gqlRequest<{ sendSms: SendSmsOutput }>(server)
      .mutate(gql`
        mutation SendSms {
          sendSms(input: { phoneNumber: "1234" }) {
            data
          }
        }
      `)
      .expectNoErrors();

    const verificationCode = `${messagingService.getVerificationCode()}wrongCode`;

    const { errors } = await gqlRequest<{ verifySms: VerifySmsOutput }>(
      server,
    ).mutate(
      gql`
      mutation SendSms {
        verifySms(input: { phoneNumber: "1234", code: "${verificationCode}", device: "test" }) {
          data {
            id
          }
        }
      }
    `,
    );

    expect(errors?.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await app.close();
  });
});
