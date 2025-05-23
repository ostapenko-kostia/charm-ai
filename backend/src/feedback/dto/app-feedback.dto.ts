import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator';

export class AppFeedbackDto {
  @IsString({ message: 'Comment must be a string' })
  @IsNotEmpty({ message: 'Comment must not be empty' })
  @ApiProperty()
  comment: string;
}
