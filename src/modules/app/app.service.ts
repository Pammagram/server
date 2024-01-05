import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly dummyText = 'Hello World!';

  getHello(): string {
    return this.dummyText;
  }
}
