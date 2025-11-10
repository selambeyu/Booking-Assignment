import { IsString, MinLength } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @MinLength(1)
  name: string;
}

