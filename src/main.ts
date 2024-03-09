import { NestFactory, Reflector} from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from './global-exception-filter';
import { QueueNames } from '@tutorify/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI],
        queue: QueueNames.ADDRESS,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  // Set up global interceptor to standardize output using class serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Use the global exception filter
  app.useGlobalFilters(new GlobalExceptionsFilter());

  await app.listen();
}
bootstrap();
