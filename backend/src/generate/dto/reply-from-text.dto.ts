import { IsArray, ValidateNested, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class MessageDto {
  @IsIn(['my', 'their'])
  @ApiProperty({ enum: ['my', 'their'], description: 'Who sent the message' })
  type: 'my' | 'their';

  @IsString()
  @ApiProperty({ description: 'Message content' })
  text: string;
}

export class ReplyFromTextDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [MessageDto],
    description: 'List of chat messages',
  })
  @Type(() => MessageDto)
  messages: MessageDto[];
}
