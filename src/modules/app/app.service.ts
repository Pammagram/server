import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // eslint-disable-next-line class-methods-use-this -- dummy method which will be removed soon.
  getHello(): string {
    return 'Hello World!';
  }
}
