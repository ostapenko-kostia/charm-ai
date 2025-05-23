import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MessageDto {
  @IsString({ message: 'Message must be a string' })
  @IsNotEmpty({ message: 'Message must not be empty' })
  @ApiProperty()
  content: string;

  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role must not be empty' })
  @IsIn(['user', 'assistant', 'system'], {
    message: 'Role must be one of the following: user, assistant, system',
  })
  @ApiProperty()
  role: 'user' | 'assistant' | 'system';
}

export class GetAdviceDto {
  @IsArray({ message: 'Messages must be an array' })
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  @ApiProperty({
    type: [MessageDto],
    description: 'List of chat messages',
  })
  messages: MessageDto[];
}
