import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ReplyFeedbackDto {
  @IsBoolean({ message: 'You must like or dislike the reply' })
  @ApiProperty()
  isLiked: boolean;

  @IsBoolean({ message: 'You must like or dislike the reply' })
  @ApiProperty()
  isDisliked: boolean;

  @IsString({ message: 'Text must be a string' })
  @IsNotEmpty({ message: 'Text must not be empty' })
  @ApiProperty()
  text: string;
}
