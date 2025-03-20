import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`App running on PORT: ${process.env.DB_PORT}`);
  await app.listen(process.env.DB_PORT ?? 3000);
}
bootstrap();
