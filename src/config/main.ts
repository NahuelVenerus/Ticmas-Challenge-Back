import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  console.log(`App running on PORT: ${process.env.DB_PORT}`);
  await app.listen(process.env.DB_PORT ?? 3000);
}
bootstrap();
