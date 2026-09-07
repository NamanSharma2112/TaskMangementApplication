import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLabelDto, UpdateLabelDto } from './dto/label.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('api')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Public()
  @Get('labels')
  findAll() {
    return this.labelsService.findAll();
  }

  @Public()
  @Post('labels')
  create(@Body() dto: CreateLabelDto) {
    return this.labelsService.create(dto);
  }

  @Public()
  @Patch('labels/:id')
  update(@Param('id') id: string, @Body() dto: UpdateLabelDto) {
    return this.labelsService.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Delete('labels/:id')
  remove(@Param('id') id: string) {
    return this.labelsService.remove(id);
  }

  @Public()
  @Get('tasks/:taskId/labels')
  findByTask(@Param('taskId') taskId: string) {
    return this.labelsService.findByTask(taskId);
  }

  @Public()
  @Post('tasks/:taskId/labels')
  attach(
    @Param('taskId') taskId: string,
    @Body() body: { labelId?: string; name?: string; color?: string },
  ) {
    return this.labelsService.attach(taskId, body || {});
  }

  @Public()
  @Delete('tasks/:taskId/labels/:labelId')
  detach(@Param('taskId') taskId: string, @Param('labelId') labelId: string) {
    return this.labelsService.detach(taskId, labelId);
  }
}
