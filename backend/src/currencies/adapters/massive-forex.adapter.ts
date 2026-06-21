import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from '../../common/utils/http-client';
import { ForexAdapter, CurrencyPair, HistoricalRate } from './forex-adapter.interface';

interface MassiveTickerResponse {
  results: Array<{
    ticker: string;
    name: string;
    market: string;
  }>;
  next_url?: string;
}

interface MassiveAggsResponse {
  results: Array<{
    t: number;
    o: number;
    h: number;
    l: number;
    c: number;
  }>;
}

@Injectable()
export class MassiveForexAdapter implements ForexAdapter {
  private readonly logger = new Logger(MassiveForexAdapter.name);
  private readonly httpClient: HttpClient;
  private readonly baseUrl?: string;
  private readonly apiKey?: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('MASSIVE_API_BASE_URL');
    this.apiKey = this.configService.get<string>('MASSIVE_API_KEY');

    if (!this.baseUrl || !this.apiKey) {
      this.logger.warn('Massive API credentials not configured. Using mock rates.');
    }

    this.httpClient = new HttpClient(this.baseUrl, {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
    });
  }

  async getPreviousClose(providerSymbol: string): Promise<HistoricalRate[]> {
    try {
      const response = await this.httpClient.get<MassiveAggsResponse>(
        `/v2/aggs/ticker/C:${providerSymbol}/prev`,
      );

      return response.results.map((item) => ({
        timestamp: item.t,
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
      }));
    } catch (error) {
      this.logger.error('Failed to fetch previous close from Massive API', error);
      return [];
    }
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {

    if (fromCurrency === toCurrency) {
      return 1;
    }

    try {
      const symbol = `${fromCurrency}${toCurrency}`;
      const rates = await this.getPreviousClose(symbol);

      return rates[0].close || 1;
    } catch (error) {
      this.logger.error(`Failed to get exchange rate for ${fromCurrency}/${toCurrency}`, error);
      return 1;
    }
  }
}
