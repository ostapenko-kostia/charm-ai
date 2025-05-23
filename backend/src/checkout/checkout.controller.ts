import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutDto, CheckoutResponse } from './dto/checkout.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User as UserDecorator } from 'src/common/decorators/user.decorator';
import { IUser } from 'src/common/typing/interfaces';
import { ApiOkResponse, ApiOperation, getSchemaPath } from '@nestjs/swagger';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @ApiOkResponse({
  schema: { allOf: [{ $ref: getSchemaPath(CheckoutResponse) }] },
  })
  @ApiOperation({ summary: 'Creates new checkout session' })
  @UseGuards(AuthGuard)
  @Post()
  async checkout(@Body() dto: CheckoutDto, @UserDecorator() user: IUser) {
    return this.checkoutService.checkout(dto.priceId, user.id);
  }
}
