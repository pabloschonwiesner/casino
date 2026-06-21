import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { ConvertBalanceDto } from './dto/convert-balance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('currencies')
export class CurrenciesController {
  constructor(private currenciesService: CurrenciesService) {}

  @Get()
  async getCurrencies() {
    return this.currenciesService.getCurrencies();
  }

  @Post('convert')
  @UseGuards(JwtAuthGuard)
  async convertBalance(@Body() dto: ConvertBalanceDto, @Request() req) {
    return this.currenciesService.convertBalance(req.user.userId, dto.targetCurrency);
  }
}
