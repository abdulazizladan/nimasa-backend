import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('NIMASA performance monitoring system')
    .setDescription('Performance monitoring system')
    .setVersion('1.0')
    .addBearerAuth()
    .setContact('Ladanski Solutions', 'https://ladanski.com.ng', 'contact@ladanski.com.ng')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap(); 
