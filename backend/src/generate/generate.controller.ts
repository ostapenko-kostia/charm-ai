import {
  Body,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User as UserDecorator } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/typing/interfaces';
import { FirstMessageDto } from './dto/first-message.dto';
import { ChatResponse, ReplyResponse } from './dto/generate-responses.dto';
import { GetAdviceDto } from './dto/get-advice.dto';
import { ReplyFromTextDto } from './dto/reply-from-text.dto';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Generate replies from chat text' })
  @ApiOkResponse({
    schema: { allOf: [{ $ref: getSchemaPath(ReplyResponse) }] },
  })
  @Post('reply/text')
  async replyFromText(
    @Body() dto: ReplyFromTextDto,
    @UserDecorator() user: IUser,
  ) {
    return this.generateService.replyFromText(dto, user);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Generate replies from chat screenshot' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    schema: { allOf: [{ $ref: getSchemaPath(ReplyResponse) }] },
  })
  @Post('reply/screenshot')
  async replyFromScreenshot(
    @UserDecorator() user: IUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.generateService.replyFromScreenshot(image, user);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Generate first messages' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    schema: { allOf: [{ $ref: getSchemaPath(ReplyResponse) }] },
  })
  @Post('first-message')
  async firstMessage(
    @UserDecorator() user: IUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    image: Express.Multer.File,

    @Body() dto: FirstMessageDto,
  ) {
    return this.generateService.firstMessage(image, dto, user);
  }

  @UseGuards(AuthGuard)
  @ApiOkResponse({
    schema: { allOf: [{ $ref: getSchemaPath(ChatResponse) }] },
  })
  @ApiOperation({ summary: 'Generate advices through chat' })
  @Post('advice')
  async getAdvice(@Body() dto: GetAdviceDto, @UserDecorator() user: IUser) {
    return this.generateService.getAdvice(dto, user);
  }
}
