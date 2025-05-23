import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CheckoutDto {
  @IsString({ message: 'Invalid product' })
  @IsNotEmpty({ message: 'Invalid product' })
  @ApiProperty()
  priceId: string;
}

export class CheckoutResponse {
  @ApiProperty()
  url: string;
}
