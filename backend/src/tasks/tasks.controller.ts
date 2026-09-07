import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  BulkUpdateTasksDto,
  CreateTaskDto,
  QueryTasksDto,
  ReorderTasksDto,
  UpdateTaskDto,
} from './dto/task.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Public } from '../common/decorators/public.decorator';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Public()
  @Get()
  findAll(@Query() query: QueryTasksDto) {
    return this.tasksService.findAll(query);
  }

  /** Same filters as GET /api/tasks, but paginated. */
  @Public()
  @Get('search')
  search(@Query() query: QueryTasksDto) {
    return this.tasksService.search(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Public()
  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser('id') userId?: string) {
    return this.tasksService.create(dto, userId);
  }

  @Public()
  @Post(':id/duplicate')
  duplicate(@Param('id') id: string, @CurrentUser('id') userId?: string) {
    return this.tasksService.duplicate(id, userId);
  }

  @Public()
  @Patch('bulk')
  bulkUpdate(@Body() dto: BulkUpdateTasksDto, @CurrentUser('id') userId?: string) {
    return this.tasksService.bulkUpdate(dto, userId);
  }

  @Public()
  @Patch('reorder')
  reorder(@Body() dto: ReorderTasksDto) {
    return this.tasksService.reorder(dto);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser('id') userId?: string,
  ) {
    return this.tasksService.update(id, dto, userId);
  }

  @Public()
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @CurrentUser('id') userId?: string,
  ) {
    return this.tasksService.updateStatus(id, body.status, userId);
  }

  @Public()
  @Patch(':id/archive')
  archive(
    @Param('id') id: string,
    @Body() body: { archived?: boolean },
    @CurrentUser('id') userId?: string,
  ) {
    return this.tasksService.archive(id, body?.archived ?? true, userId);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId?: string) {
    return this.tasksService.remove(id, userId);
  }
}
