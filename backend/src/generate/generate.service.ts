import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Credits, PLAN } from '@prisma/client';
import { ChatCompletionContentPart } from 'openai/resources/chat';
import { IUser } from 'src/common/typing/interfaces';
import { OpenAIService } from 'src/openai/openai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CHAT_PROMPT } from './constants/chat-prompt.constant';
import { FIRST_MESSAGE_PROMPT } from './constants/first-message-prompt.constant';
import { REPLY_FROM_SCREENSHOT_PROMPT } from './constants/reply-from-screenshot-prompt.constant';
import { REPLY_FROM_TEXT_PROMPT } from './constants/reply-from-text-prompt.constant';
import { FirstMessageDto } from './dto/first-message.dto';
import { GetAdviceDto } from './dto/get-advice.dto';
import { ReplyFromTextDto } from './dto/reply-from-text.dto';

@Injectable()
export class GenerateService {
  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
  ) {}

  private readonly languages = {
    eng: 'English',
    ukr: 'Ukrainian',
    rus: 'Russian',
  };

  async replyFromText(dto: ReplyFromTextDto, user: IUser) {
    const { messages } = dto;

    // Generating Prompt
    const prompt = `${messages
      .map(
        (message, index) =>
          `${index + 1}. **${message.type === 'my' ? 'Me' : 'Them'}:** ${message.text}`,
      )
      .join('\n')}`;

    // Generating Response
    const response = await this.openai.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: REPLY_FROM_TEXT_PROMPT },
        { role: 'user', content: prompt },
      ],
    });

    // Formatting Response and Deducting Credits
    const replies = this.splitReplies(response.choices[0].message.content);
    const updatedCredits = await this.deductCredits(user, PLAN.PRO, 'getReply');

    // Returning Data
    return {
      replies,
      credits: updatedCredits || null,
    };
  }

  async replyFromScreenshot(image: Express.Multer.File, user: IUser) {
    const mimeType = image.mimetype;
    const base64 = Buffer.from(image.buffer).toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Generating Response
    const response = await this.openai.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: REPLY_FROM_SCREENSHOT_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
    });

    // Formatting Response and Deducting Credits
    const replies = this.splitReplies(response.choices[0].message.content);
    const updatedCredits = await this.deductCredits(user, PLAN.PRO, 'getReply');

    // Returning Data
    return {
      replies,
      credits: updatedCredits || null,
    };
  }

  async firstMessage(
    image: Express.Multer.File,
    dto: FirstMessageDto,
    user: IUser,
  ) {
    // Validating Input
    const { language } = dto;

    const mimeType = image.mimetype;
    const base64 = Buffer.from(image.buffer).toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Formatting Content
    const content: ChatCompletionContentPart[] = [
      {
        type: 'text',
        text: `Generate messages in ${
          this.languages[language as keyof typeof this.languages] || 'English'
        } language.`,
      },
    ];

    if (dataUrl)
      content.push({
        type: 'image_url',
        image_url: { url: dataUrl },
      });

    // Generating First Messages
    const response = await this.openai.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: [{ type: 'text', text: FIRST_MESSAGE_PROMPT }],
        },
        {
          role: 'user',
          content,
        },
      ],
    });

    // Formatting Response and Deducting Credits
    const replies = this.splitReplies(response.choices[0].message.content);
    const updatedCredits = await this.deductCredits(
      user,
      PLAN.PREMIUM,
      'getPickup',
    );

    // Returning Data
    return {
      replies,
      credits: updatedCredits || null,
    };
  }

  async getAdvice(dto: GetAdviceDto, user: IUser) {
    // Validating Input
    const { messages } = dto;

    const chat = `${messages
      .map((message, i) => `${i + 1}. ${message.role}: ${message.content}`)
      .join('\n')}`;

    // Generating Response
    const response = await this.openai.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: chat },
        { role: 'system', content: CHAT_PROMPT },
      ],
    });

    // Formatting Response
    let reply = response.choices[0].message.content;

    if (!reply)
      throw new InternalServerErrorException('Failed to generate replies');

    if (reply.startsWith('```html')) {
      reply = reply.slice(7).trim();
    }
    if (reply.endsWith('```')) {
      reply = reply.slice(0, -3).trim();
    }

    messages.push({ role: 'assistant', content: reply });

    //  Deducting Credits
    const credits = await this.deductCredits(user, PLAN.PREMIUM, 'getAdvice');

    return { messages, credits };
  }

  private splitReplies(input: string | null) {
    if (!input)
      throw new InternalServerErrorException('Failed to generate replies');

    const replies = input
      ?.split('|||')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 3);

    if (!replies || replies.length === 0) {
      throw new InternalServerErrorException('Failed to generate replies');
    }

    return replies;
  }

  private async deductCredits(
    user: IUser,
    requiredPlan: PLAN,
    type: 'getReply' | 'getPickup' | 'getAdvice',
  ): Promise<Credits | null> {
    const hasActiveSubscription =
      user.subscription?.plan === requiredPlan &&
      user.subscription.status === 'ACTIVE';

    if (hasActiveSubscription) {
      return await this.prisma.credits.findUnique({
        where: { userId: user.id },
      });
    }

    if (!user.credits?.[type] || user.credits[type] <= 0)
      throw new BadRequestException('Not enough credits');

    return await this.prisma.credits.update({
      where: { userId: user.id },
      data: { [type]: { decrement: 1 } },
    });
  }
}
