import { Injectable } from '@nestjs/common';
import { ReplyFeedbackDto } from './dto/reply-feedback.dto';
import { IUser } from 'src/common/typing/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppFeedbackDto } from './dto/app-feedback.dto';
import { AppLogger } from 'src/logger/logger.service';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async replyFeedback(dto: ReplyFeedbackDto, user: IUser) {
    const { isLiked, isDisliked, text } = dto;

    const existingFeedback = await this.prisma.replyFeedback.findFirst({
      where: {
        userId: user.id,
        text: text ?? '',
      },
    });

    await this.prisma.replyFeedback.upsert({
      where: {
        id: existingFeedback?.id ?? '',
      },
      update: {
        isLiked: isLiked ?? false,
        isDisliked: isDisliked ?? false,
      },
      create: {
        isLiked: isLiked || false,
        isDisliked: isDisliked || false,
        text: text ?? '',
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    this.logger.log(
      `New Reply Feedback: ${text} from user: ${user.id}. Verdict: ${isLiked ? 'Liked' : isDisliked ? 'Disliked' : 'Neutral'}`,
    );

    return {
      message: 'Feedback submitted successfully',
    };
  }

  async appFeedback(dto: AppFeedbackDto, user: IUser) {
    const { comment } = dto;

    await this.prisma.feedback.create({
      data: {
        comment,
        userId: user.id,
      },
    });

    this.logger.log(`New App Feedback: ${comment} from user: ${user.id}`);

    return { message: 'Feedback submitted successfully' };
  }
}
