import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  SequelizeHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('system')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private readonly memoryHeapThreshold = 800 * 1024 * 1024; // 800MB
  private readonly memoryRssThreshold = 150 * 1024 * 1024; // 150MB

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private sequelize: SequelizeHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  @Get('db')
  @HealthCheck()
  checkDb() {
    return this.health.check([
      () => this.sequelize.pingCheck('database', { timeout: 3000 }),
    ]);
  }

  @Get('memory')
  @HealthCheck()
  checkMemory() {
    this.logger.log('Running memory health check');
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', this.memoryHeapThreshold),
      () => this.memory.checkRSS('memory_rss', this.memoryRssThreshold),
    ]);
  }

  @Get('memory/detailed')
  async getMemoryUsage() {
    const memoryUsage = process.memoryUsage();

    const memoryUsageMB = {
      rss: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
      heapTotal: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
      heapUsed: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
      external: Math.round((memoryUsage.external / 1024 / 1024) * 100) / 100,
      arrayBuffers:
        Math.round((memoryUsage.arrayBuffers / 1024 / 1024) * 100) / 100,
    };

    const heapUsagePercent = Math.round(
      (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
    );
    const rssUsagePercent = Math.round(
      (memoryUsage.rss / this.memoryRssThreshold) * 100,
    );

    const status = {
      status: rssUsagePercent > 90 || heapUsagePercent > 90 ? 'warning' : 'ok',
      timestamp: new Date().toISOString(),
      details: {
        ...memoryUsageMB,
        heapUsagePercent,
        rssUsagePercent,
        thresholds: {
          heapMB: Math.round(this.memoryHeapThreshold / 1024 / 1024),
          rssMB: Math.round(this.memoryRssThreshold / 1024 / 1024),
        },
      },
    };

    if (status.status === 'warning') {
      this.logger.warn(
        `Memory usage warning: RSS ${rssUsagePercent}%, Heap ${heapUsagePercent}%`,
      );
    }

    return status;
  }
}
