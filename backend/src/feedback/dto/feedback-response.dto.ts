import { ApiProperty } from '@nestjs/swagger'

export class FeedbackResponse {
  @ApiProperty()
  message: string;
}
