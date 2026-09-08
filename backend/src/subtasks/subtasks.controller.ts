import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto/subtask.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('api')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Public()
  @Get('tasks/:taskId/subtasks')
  findByTask(@Param('taskId') taskId: string) {
    return this.subtasksService.findByTask(taskId);
  }

  @Public()
  @Get('tasks/:taskId/subtasks/progress')
  progress(@Param('taskId') taskId: string) {
    return this.subtasksService.progress(taskId);
  }

  @Public()
  @Post('tasks/:taskId/subtasks')
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateSubtaskDto,
    @CurrentUser('id') actorId?: string,
  ) {
    return this.subtasksService.create(taskId, dto, actorId);
  }

  @Public()
  @Patch('tasks/:taskId/subtasks/reorder')
  reorder(@Param('taskId') taskId: string, @Body() body: { orderedIds: string[] }) {
    return this.subtasksService.reorder(taskId, body?.orderedIds || []);
  }

  @Public()
  @Patch('subtasks/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSubtaskDto,
    @CurrentUser('id') actorId?: string,
  ) {
    return this.subtasksService.update(id, dto, actorId);
  }

  @Public()
  @Delete('subtasks/:id')
  remove(@Param('id') id: string, @CurrentUser('id') actorId?: string) {
    return this.subtasksService.remove(id, actorId);
  }
}
