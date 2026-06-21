import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DecimalUtils } from '../common/utils/decimal.utils';
import type { ForexAdapter } from './adapters/forex-adapter.interface';
import { FOREX_ADAPTER } from './adapters/forex-adapter.token';

interface ExchangeRate {
  rate: number;
  timestamp: Date;
}

@Injectable()
export class CurrenciesService {
  private rateCache = new Map<string, ExchangeRate>();
  private readonly CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour
  private readonly USD_BASE_RATE = 1; // 1 coin = 1 USD

  constructor(
    private prisma: PrismaService,
    @Inject(FOREX_ADAPTER) private forexAdapter: ForexAdapter,
  ) {}

  async getCurrencies() {
    return this.prisma.currency.findMany({
      select: {
        code: true,
        name: true,
        symbol: true,
        decimalPlaces: true,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  async convertBalance(userId: string, targetCurrencyCode: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const currency = await this.prisma.currency.findUnique({
      where: { code: targetCurrencyCode },
    });

    if (!currency) {
      throw new BadRequestException('Unsupported currency.');
    }

    const exchangeRate = await this.getExchangeRate(targetCurrencyCode);
    const balanceInUSD = DecimalUtils.parseDecimal(user.balance.toString());
    const convertedBalance = DecimalUtils.multiply(balanceInUSD, exchangeRate.rate);

    return {
      originalBalance: user.balance.toString(),
      originalCurrency: 'USD',
      convertedBalance: convertedBalance.toFixed(currency.decimalPlaces),
      targetCurrency: targetCurrencyCode,
      exchangeRate: exchangeRate.rate.toString(),
      timestamp: exchangeRate.timestamp.toISOString(),
    };
  }

  private async getExchangeRate(currencyCode: string): Promise<ExchangeRate> {
    if (currencyCode === 'USD') {
      return {
        rate: this.USD_BASE_RATE,
        timestamp: new Date(),
      };
    }

    const cached = this.rateCache.get(currencyCode);
    const now = new Date();

    if (cached && now.getTime() - cached.timestamp.getTime() < this.CACHE_DURATION_MS) {
      return cached;
    }

    const rate = await this.fetchExchangeRate(currencyCode);
    const exchangeRate: ExchangeRate = {
      rate,
      timestamp: now,
    };

    this.rateCache.set(currencyCode, exchangeRate);
    return exchangeRate;
  }

  private async fetchExchangeRate(currencyCode: string): Promise<number> {
    return this.forexAdapter.getExchangeRate('USD', currencyCode);
  }
}
