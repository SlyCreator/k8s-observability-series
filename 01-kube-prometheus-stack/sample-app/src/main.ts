import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 0.0.0.0 matters in a container: binding to localhost makes the pod
  // unreachable from the Service, and Prometheus will report the target DOWN
  // with "connection refused".
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
