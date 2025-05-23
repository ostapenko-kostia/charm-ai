import { ApiProperty } from '@nestjs/swagger';
import { MessageDto } from './get-advice.dto';

class Credits {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  getReply: number;
  @ApiProperty()
  getPickup: number;
  @ApiProperty()
  getAdvice: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class ReplyResponse {
  @ApiProperty()
  replies: string[];

  @ApiProperty()
  credits: Credits;
}

export class ChatResponse {
  @ApiProperty()
  messages: MessageDto[];

  @ApiProperty()
  credits: Credits;
}
