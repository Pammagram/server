import { CONFIG_PROVIDER, ConfigType } from '@config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigType>(CONFIG_PROVIDER);

  const { cookieSecret } = config.security;

  app.use(cookieParser(cookieSecret));
  const { port } = config.app;

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  await app.listen(port);
}

void bootstrap();
