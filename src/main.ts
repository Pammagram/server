import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // eslint-disable-next-line no-magic-numbers -- must be removed in the future.
  await app.listen(8080);
}

void bootstrap();
