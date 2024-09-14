import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(cookieParser());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('FCT App API')
    .setDescription('Documentação da API do FCT App')
    .setVersion(null)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {});
  await app.listen(3000);
}
bootstrap();
