import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT || 3000;
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  
  // Enable CORS for frontend
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  await app.listen(port);
  console.log(`Backend server running on http://localhost:${port}`);
}
bootstrap();

