import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export const SUBTASK_PRIORITIES = ['no-priority', 'low', 'medium', 'high', 'urgent'];

export class CreateSubtaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Subtask title is required' })
  title: string;

  @IsOptional()
  @IsString()
  @IsIn(SUBTASK_PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

export class UpdateSubtaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Subtask title cannot be empty' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsIn(SUBTASK_PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
