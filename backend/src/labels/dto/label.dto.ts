import { IsHexColor, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  @IsNotEmpty({ message: 'Label name is required' })
  @MaxLength(32, { message: 'Label name must be 32 characters or fewer' })
  name: string;

  @IsOptional()
  @IsHexColor({ message: 'Label color must be a hex value such as #6366f1' })
  color?: string;
}

export class UpdateLabelDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Label name cannot be empty' })
  @MaxLength(32, { message: 'Label name must be 32 characters or fewer' })
  name?: string;

  @IsOptional()
  @IsHexColor({ message: 'Label color must be a hex value such as #6366f1' })
  color?: string;
}
