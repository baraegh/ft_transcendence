import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('ft_transcendence API')
  .setDescription('The ft_transcendence API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: [process.env.FRONTEND_URL], // Add the home page URL to the allowed origins
    methods: ['POST', 'PUT', 'GET', 'PATCH'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  

  app.use(cookieParser());
  // await app.listen(3000, () => {
  //   console.log(`Server is running on ${process.env.BACKEND_URL}`);
  // });
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
