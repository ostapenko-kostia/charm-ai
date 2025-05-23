import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class FirstMessageDto {
  @IsString({ message: 'Language must be a string' })
  @IsNotEmpty({ message: 'Language must not be empty' })
  @IsIn(['eng', 'rus', 'ukr'], {
    message: 'Language must be one of the following: eng, rus, ukr',
  })
  @ApiProperty()
  language: 'eng' | 'rus' | 'ukr';
}
