import { Controller, Get, Param, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('api')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Public()
  @Get('activity')
  findAll(@Query('limit') limit?: string) {
    return this.activityService.findAll(limit ? parseInt(limit, 10) : 50);
  }

  @Public()
  @Get('tasks/:taskId/activity')
  findByTask(@Param('taskId') taskId: string) {
    return this.activityService.findByTask(taskId);
  }

  @Public()
  @Get('projects/:projectId/activity')
  findByProject(@Param('projectId') projectId: string) {
    return this.activityService.findByProject(projectId);
  }
}
