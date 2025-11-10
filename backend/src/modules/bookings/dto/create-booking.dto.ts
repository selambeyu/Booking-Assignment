import { IsInt, IsDateString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  resource_id: number;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;
}

