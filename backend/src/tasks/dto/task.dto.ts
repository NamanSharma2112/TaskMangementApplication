import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export const TASK_STATUSES = [
  'todo',
  'in-progress',
  'doing',
  'completed',
  'on-hold',
  'backlog',
];

export const TASK_PRIORITIES = ['no-priority', 'low', 'medium', 'high', 'urgent'];

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Task title is required' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(TASK_STATUSES)
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(TASK_PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimateHours?: number;

  /** Label names — unknown names are created on the fly. */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Task title cannot be empty' })
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(TASK_STATUSES)
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(TASK_PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimateHours?: number;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];
}

export class QueryTasksDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  category?: string;

  /** Label name to filter by. */
  @IsOptional()
  @IsString()
  label?: string;

  /** "true" includes archived tasks, "only" returns just archived ones. */
  @IsOptional()
  @IsString()
  @IsIn(['true', 'false', 'only'])
  archived?: string;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title', 'position'])
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class BulkUpdateTasksDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'Provide at least one task id' })
  @IsString({ each: true })
  ids: string[];

  @IsOptional()
  @IsString()
  @IsIn(TASK_STATUSES)
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(TASK_PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;
}

export class ReorderTasksDto {
  @IsString()
  @IsIn(TASK_STATUSES)
  status: string;

  @IsArray()
  @IsString({ each: true })
  orderedIds: string[];
}
