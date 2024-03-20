import { Config } from '@config';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Config>>(ConfigService);

  const cookieSecret = configService.getOrThrow('security.cookieSecret', {
    infer: true,
  });

  const port = configService.getOrThrow('app.port', {
    infer: true,
  });

  app.use(cookieParser(cookieSecret));

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  await app.listen(port);
}

void bootstrap();
