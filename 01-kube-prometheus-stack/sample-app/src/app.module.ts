import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        // Node.js runtime metrics: heap size, GC pauses, event loop lag,
        // active handles. Free, and genuinely useful for debugging.
        enabled: true,
      },
      // The path Prometheus scrapes. Must match `path` in the ServiceMonitor.
      path: '/metrics',
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
