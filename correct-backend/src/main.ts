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
    .setTitle('Compliance Backend')
    .setDescription('The Compliance Description')
    .setVersion('1.0')
    .addTag('Compliance')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Compliance API Docs',
    customfavIcon:
      'https://cdn.iconscout.com/icon/free/png-256/free-correct-1-226447.png',
    customCss: '.swagger-ui .topbar { display: none }',
    jsonDocumentUrl: '/docs-json',
  });

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
