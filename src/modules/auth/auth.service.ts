import { Injectable, NotFoundException } from '@nestjs/common';

import { UserService } from '../user/user.service';

// eslint-disable-next-line no-magic-numbers -- Amount of spaces
const prettify = (value: unknown): string => JSON.stringify(value, null, 2);

type Otp = {
  code: number;
  phoneNumber: string;
};

let otpCodes: Otp[] = [];

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  verifySms(phoneNumber: string, code: number): boolean {
    const possibleOtpCodes = otpCodes.filter(
      (otp) => otp.phoneNumber === phoneNumber,
    );

    console.debug('Possible otp codes: ', prettify(possibleOtpCodes));

    const otp = possibleOtpCodes.find(
      (existingOtp) => existingOtp.code === code,
    );

    if (!otp) {
      throw new NotFoundException("Didn't found matching otp");
    }

    otpCodes = otpCodes.filter(
      (existingOtp) =>
        existingOtp.code !== otp.code &&
        existingOtp.phoneNumber !== otp.phoneNumber,
    );

    return true;
  }

  // TODO cleanup of unutilized users
  async sendSms(phoneNumber: string): Promise<true> {
    let user = await this.userService.findByPhoneNumber(phoneNumber);

    if (!user) {
      console.debug('User does not exist, creating...');
      // ? TODO we can utilize redis and store temp user there with TMP
      user = await this.userService.createUser({
        phoneNumber,
        username: null,
      });
    }

    this.sendOtp(phoneNumber);

    return true;
  }

  sendOtp(phoneNumber: string): boolean {
    // TODO save otp code somewhere
    const maxNumber = 9999;
    const minNumber = 0;
    const otpCode = Number(minNumber + (Math.random() * maxNumber).toFixed(0));

    otpCodes.push({
      code: otpCode,
      phoneNumber,
    });

    console.debug('Generated otp code: ', otpCode);

    // TODO send message

    return true;
  }
}
