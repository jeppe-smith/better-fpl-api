import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const app = await NestFactory.create(AppModule, { logger: isDevelopment });

  app.enableCors();

  if (!isDevelopment) {
    app.useLogger(app.get(Logger));
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
