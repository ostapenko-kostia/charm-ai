import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { User as UserDecorator } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/typing/interfaces';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ReplyFeedbackDto } from './dto/reply-feedback.dto';
import { AppFeedbackDto } from './dto/app-feedback.dto';
import { ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { FeedbackResponse } from './dto/feedback-response.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiOkResponse({
    schema: { allOf: [{ $ref: getSchemaPath(FeedbackResponse) }] },
  })
  @ApiOperation({ summary: 'Submits reply feedback' })
  @UseGuards(AuthGuard)
  @Post('reply')
  async replyFeedback(
    @UserDecorator() user: IUser,
    @Body() dto: ReplyFeedbackDto,
  ) {
    return this.feedbackService.replyFeedback(dto, user);
  }

  @ApiOkResponse({
    schema: { allOf: [{ $ref: getSchemaPath(FeedbackResponse) }] },
  })
  @ApiOperation({ summary: 'Submits app feedback' })
  @UseGuards(AuthGuard)
  @Post('app')
  async appFeedback(@UserDecorator() user: IUser, @Body() dto: AppFeedbackDto) {
    return this.feedbackService.appFeedback(dto, user);
  }
}
