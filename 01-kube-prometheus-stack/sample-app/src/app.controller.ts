import { Controller, Get } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';

// Counter: monotonically increasing. Use for request counts, errors, events.
// You almost never read a counter directly — you read rate() of it.
const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

// Histogram: records a distribution so you can compute percentiles later with
// histogram_quantile(). Buckets are cumulative and chosen up front — you cannot
// add resolution retroactively, so pick a range that covers your real latencies.
const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

@Controller()
export class AppController {
  @Get('/')
  getHello(): string {
    const timer = httpRequestDuration.startTimer({ method: 'GET', path: '/', status: '200' });
    httpRequestTotal.inc({ method: 'GET', path: '/', status: '200' });
    timer();
    return 'Hello from monitored NestJS!';
  }

  // A deliberately slow endpoint, so the latency histogram has a visible spread
  // instead of everything landing in the smallest bucket.
  @Get('/slow')
  async getSlow(): Promise<string> {
    const timer = httpRequestDuration.startTimer({ method: 'GET', path: '/slow', status: '200' });
    await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 400));
    httpRequestTotal.inc({ method: 'GET', path: '/slow', status: '200' });
    timer();
    return 'This was a slow response';
  }

  // Increments the counter with status="500" before throwing, so you have a
  // non-zero error rate to query and alert on in Articles 2 and 3.
  @Get('/error')
  getError(): void {
    httpRequestTotal.inc({ method: 'GET', path: '/error', status: '500' });
    throw new Error('Simulated error');
  }
}
