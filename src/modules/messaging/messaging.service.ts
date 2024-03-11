import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Twilio } from 'twilio';

import { ConfigType } from '$config';
import { Config } from '$modules/common/decorators';

type SendVerificationCodeParams = {
  phoneNumber: string;
};

type ValidateVerificationCodeParams = {
  code: string;
  phoneNumber: string;
};

@Injectable()
export class MessagingService {
  private readonly twilioClient: Twilio;

  private readonly config: ConfigType['auth'];

  constructor(
    @Config()
    configService: ConfigType,
  ) {
    this.config = configService.auth;
    const { twilioAccountServiceId, twilioAuthToken } = this.config;

    this.twilioClient = new Twilio(twilioAccountServiceId, twilioAuthToken);
  }

  async sendVerificationCode(params: SendVerificationCodeParams) {
    const { phoneNumber } = params;
    const { twilioVerificationServiceId } = this.config;

    await this.twilioClient.verify.v2
      .services(twilioVerificationServiceId)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });
  }

  async validateVerificationCode(params: ValidateVerificationCodeParams) {
    const { phoneNumber, code } = params;
    const { twilioVerificationServiceId } = this.config;

    const verification = await this.twilioClient.verify.v2
      .services(twilioVerificationServiceId)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });

    if (verification.status !== 'approved') {
      throw new NotAcceptableException('Invalid verification code');
    }
  }
}
