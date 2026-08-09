import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/resource.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('api')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Public()
  @Get('tasks/:taskId/resources')
  findByTask(@Param('taskId') taskId: string) {
    return this.resourcesService.findByTask(taskId);
  }

  @Public()
  @Post('tasks/:taskId/resources')
  create(@Param('taskId') taskId: string, @Body() dto: CreateResourceDto) {
    return this.resourcesService.create(taskId, dto);
  }

  @Public()
  @Delete('resources/:id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
