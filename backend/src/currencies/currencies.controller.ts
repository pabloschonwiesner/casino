import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiBody } from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { ConvertBalanceDto } from './dto/convert-balance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private currenciesService: CurrenciesService) {}

  @ApiOperation({ summary: 'Get list of available currencies' })
  @ApiResponse({ status: 200, description: 'Returns list of currencies with code, name, symbol, and decimal places.' })
  @Get()
  async getCurrencies() {
    return this.currenciesService.getCurrencies();
  }

  @ApiOperation({ summary: 'Convert user balance to another currency (display only)' })
  @ApiCookieAuth('access_token')
  @ApiBody({ type: ConvertBalanceDto })
  @ApiResponse({ status: 200, description: 'Returns converted balance with exchange rate and timestamp. Original balance is NOT modified.' })
  @ApiResponse({ status: 400, description: 'Unsupported currency or user not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('convert')
  @UseGuards(JwtAuthGuard)
  async convertBalance(@Body() dto: ConvertBalanceDto, @Request() req) {
    return this.currenciesService.convertBalance(req.user.userId, dto.targetCurrency);
  }
}
