import { Controller, Get, Header, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/alive')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  alive() {
    return 'alive';
  }
}
