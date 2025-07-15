import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Solana Near Me API')
    .setDescription('API for Solana blockchain data and services')
    .setVersion('1.0')
    .addTag('solana', 'Solana blockchain related endpoints')
    .addTag('web3', 'Web3 blockchain operations')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT ?? 4200;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
