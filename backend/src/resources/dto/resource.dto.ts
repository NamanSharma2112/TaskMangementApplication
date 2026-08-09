import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty({ message: 'Resource title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Resource URL is required' })
  url: string;
}
