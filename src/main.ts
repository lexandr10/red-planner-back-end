import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as coockieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")
  app.use(coockieParser())
  app.enableCors(
    {
      origin: ['http://localhost:3000', 'https://lexandr10.github.io/red-planner-front-end'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
      exposedHeaders: ['Set-Cookie']
    }
  )

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
}
bootstrap();
