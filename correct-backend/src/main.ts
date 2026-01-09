import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './core/filters/sequelize-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());
  app.use(morgan('common'));

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );

  app.use(helmet());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://650d6b47901c.ngrok-free.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Correct Compliance - API')
    .setDescription(
      'The API documentation for Correct Compliance backend. This API handles authentication, company filings, document extraction, and compliance tasks.',
    )
    .setVersion('1.1.0')
    .addTag('auth', 'Identity and Access Management')
    .addTag('user', 'User Profile and Management')
    .addTag('company', 'Company and Business logic')
    .addTag('compliance', 'Compliance monitoring and tasks')
    .addTag('vault', 'Secure Document Storage')
    .addTag('notifications', 'Push and in-app notifications')
    .addTag('ai-chat', 'AI Conversation and Mastra integration')
    .addTag('extraction', 'Document processing and AI extraction')
    .addTag('admin', 'Administrative operations')
    .addTag('billing', 'Subscription and billing management')
    .addTag('system', 'Core system and health checks')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Correct API Docs',
    customfavIcon:
      'https://cdn.iconscout.com/icon/free/png-256/free-correct-1-226447.png',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin-bottom: 20px }
    `,
    jsonDocumentUrl: '/docs-json',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  });

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
