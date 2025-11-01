import express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const config = new DocumentBuilder()
    .setTitle('SMK Muhammadiyah 3 Dolopo API')
    .setDescription('API documentation SMK Muhammadiyah 3 Dolopo.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'SMK Muhammadiyah 3 Dolopo API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.init();
}

bootstrap();

export default server;