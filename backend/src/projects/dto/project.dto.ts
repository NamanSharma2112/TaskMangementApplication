import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const PROJECT_STATUSES = ['Active', 'Planning', 'On Hold', 'Completed', 'Archived'];
export const PROJECT_PRIORITIES = ['no-priority', 'low', 'medium', 'high', 'urgent'];

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project title is required' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  @IsIn(PROJECT_STATUSES)
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(PROJECT_PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  leadId?: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Project title cannot be empty' })
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  @IsIn(PROJECT_STATUSES)
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(PROJECT_PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  leadId?: string;
}
