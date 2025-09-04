import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { dirname } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/static', express.static(dirname(dirname(__dirname)) + '/uploads/'));
  app.enableCors({
    origin: '*', // Substitua pelo domínio do seu cliente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Avaliação API')
    .setDescription(
      'API para avaliação de desempenho do candidato ao processo seletivo da NASA',
    )
    .setVersion('1.0')
    .addTag('users', 'O endpoint de usuários requer autenticação')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Servidor backend iniciado na porta ${process.env.PORT ?? 3001}`);
  console.log(`Para acessar o Swagger: http://{dominio}:${process.env.PORT ?? 3001}/api/docs`);
  console.log(`A API estará disponível em: http://{dominio}:${process.env.PORT ?? 3001}/`);
}
bootstrap();
