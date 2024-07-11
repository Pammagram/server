import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  @Get('/alive')
  @HttpCode(HttpStatus.OK)
  alive() {
    this.logger.debug('alive');

    return 'alive';
  }
}
