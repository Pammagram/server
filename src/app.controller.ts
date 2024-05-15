import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/alive')
  @HttpCode(HttpStatus.OK)
  alive() {
    return 'alive';
  }
}
