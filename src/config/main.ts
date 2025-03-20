import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  console.log(`App running on PORT: ${process.env.DB_PORT}`);
  await app.listen(process.env.DB_PORT ?? 3000);
}
bootstrap();
