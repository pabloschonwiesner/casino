import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForexAdapter } from './adapters/forex-adapter.interface';
import { FOREX_ADAPTER } from './adapters/forex-adapter.token';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let prisma: PrismaService;
  let forexAdapter: ForexAdapter;

  const mockPrismaService = {
    currency: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockForexAdapter = {
    getExchangeRate: jest.fn(),
    getPreviousClose: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: FOREX_ADAPTER,
          useValue: mockForexAdapter,
        },
      ],
    }).compile();

    service = module.get<CurrenciesService>(CurrenciesService);
    prisma = module.get<PrismaService>(PrismaService);
    forexAdapter = module.get<ForexAdapter>(FOREX_ADAPTER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrencies', () => {
    it('should return list of currencies', async () => {
      const mockCurrencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2 },
        { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2 },
      ];
      mockPrismaService.currency.findMany.mockResolvedValue(mockCurrencies);

      const result = await service.getCurrencies();

      expect(result).toEqual(mockCurrencies);
      expect(mockPrismaService.currency.findMany).toHaveBeenCalledWith({
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
    });
  });

  describe('convertBalance', () => {
    it('should convert balance to target currency', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        balance: '100.00',
      });
      mockPrismaService.currency.findUnique.mockResolvedValue({
        code: 'EUR',
        decimalPlaces: 2,
      });
      mockForexAdapter.getExchangeRate.mockResolvedValue(0.92);

      const result = await service.convertBalance('user-1', 'EUR');

      expect(result.originalBalance).toBe('100.00');
      expect(result.originalCurrency).toBe('USD');
      expect(result.convertedBalance).toBe('92.00');
      expect(result.targetCurrency).toBe('EUR');
      expect(result.exchangeRate).toBe('0.92');
      expect(mockForexAdapter.getExchangeRate).toHaveBeenCalledWith('USD', 'EUR');
    });

    it('should throw BadRequestException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.convertBalance('user-1', 'EUR'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when currency not supported', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        balance: '100.00',
      });
      mockPrismaService.currency.findUnique.mockResolvedValue(null);

      await expect(
        service.convertBalance('user-1', 'XYZ'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should cache exchange rates for 1 hour', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        balance: '100.00',
      });
      mockPrismaService.currency.findUnique.mockResolvedValue({
        code: 'EUR',
        decimalPlaces: 2,
      });
      mockForexAdapter.getExchangeRate.mockResolvedValue(0.92);

      await service.convertBalance('user-1', 'EUR');
      await service.convertBalance('user-1', 'EUR');

      expect(mockForexAdapter.getExchangeRate).toHaveBeenCalledTimes(1);
    });
  });
});
