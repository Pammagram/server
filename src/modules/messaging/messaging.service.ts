import { ConfigType } from '@config';
import { Config } from '@modules/common/decorators';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Twilio } from 'twilio';

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

  private readonly authConfig: ConfigType['auth'];

  constructor(
    @Config()
    configService: ConfigType,
  ) {
    this.authConfig = configService.auth;
    const { twilioAccountServiceId, twilioAuthToken } = this.authConfig;

    this.twilioClient = new Twilio(twilioAccountServiceId, twilioAuthToken);
  }

  async sendVerificationCode(params: SendVerificationCodeParams) {
    const { phoneNumber } = params;
    const { twilioVerificationServiceId } = this.authConfig;

    await this.twilioClient.verify.v2
      .services(twilioVerificationServiceId)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });
  }

  async validateVerificationCode(params: ValidateVerificationCodeParams) {
    const { phoneNumber, code } = params;
    const { twilioVerificationServiceId } = this.authConfig;

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
