import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Public()
  @Get()
  overview(@Query('days') days?: string) {
    return this.analyticsService.overview(days ? parseInt(days, 10) : 14);
  }

  @Public()
  @Get('summary')
  summary() {
    return this.analyticsService.summary();
  }

  @Public()
  @Get('workload')
  workload() {
    return this.analyticsService.workload();
  }

  @Public()
  @Get('throughput')
  throughput(@Query('days') days?: string) {
    return this.analyticsService.throughput(days ? parseInt(days, 10) : 14);
  }

  @Public()
  @Get('projects')
  projects() {
    return this.analyticsService.projectBreakdown();
  }
}
