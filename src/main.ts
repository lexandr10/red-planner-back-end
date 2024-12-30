import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as coockieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api")
  app.use(coockieParser())
  app.enableCors(
    {
      origin: [ "https://red-planner-front-end.onrender.com", "http://localhost:3000"],
      credentials: true,
      exposedHeaders: 'set-cookie'
    }
  )

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
}
bootstrap();
