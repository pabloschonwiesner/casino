import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Casino API')
    .setDescription('Casino backend API with slot machine games, user authentication, and currency conversion')
    .setVersion('1.0')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
      description: 'JWT token stored in HttpOnly cookie',
    })
    .addTag('Auth', 'Authentication and user management')
    .addTag('Countries', 'Country information')
    .addTag('Currencies', 'Currency information and conversion')
    .addTag('Games', 'Game catalog and details')
    .addTag('Favorites', 'User favorite games')
    .addTag('Slots', 'Slot machine gameplay')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`API Documentation available at: http://localhost:${port}/api/docs`);
    logger.log(`CORS enabled for: ${frontendUrl}`);
  });
  
}
bootstrap();
