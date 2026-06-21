import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SlotsService', () => {
  let service: SlotsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    game: {
      findUnique: jest.fn(),
    },
    spinHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SlotsService>(SlotsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Payout Calculation', () => {
    it('should calculate correct payout for cherry_cherry_cherry (50x)', () => {
      const reels: [string, string, string] = ['cherry', 'cherry', 'cherry'];
      const betAmount = 1.0;
      const payout = service['calculatePayout'](reels, betAmount);
      expect(payout).toBe(50);
    });

    it('should calculate correct payout for cherry_cherry_lemon (40x)', () => {
      const reels: [string, string, string] = ['cherry', 'cherry', 'lemon'];
      const betAmount = 1.0;
      const payout = service['calculatePayout'](reels, betAmount);
      expect(payout).toBe(40);
    });

    it('should calculate correct payout for apple_apple_apple (20x)', () => {
      const reels: [string, string, string] = ['apple', 'apple', 'apple'];
      const betAmount = 2.0;
      const payout = service['calculatePayout'](reels, betAmount);
      expect(payout).toBe(40);
    });

    it('should calculate correct payout for banana_banana_banana (15x)', () => {
      const reels: [string, string, string] = ['banana', 'banana', 'banana'];
      const betAmount = 1.0;
      const payout = service['calculatePayout'](reels, betAmount);
      expect(payout).toBe(15);
    });

    it('should calculate correct payout for lemon_lemon_lemon (3x)', () => {
      const reels: [string, string, string] = ['lemon', 'lemon', 'lemon'];
      const betAmount = 1.0;
      const payout = service['calculatePayout'](reels, betAmount);
      expect(payout).toBe(3);
    });

    it('should return 0 for non-winning combination', () => {
      const reels: [string, string, string] = ['cherry', 'apple', 'banana'];
      const betAmount = 1.0;
      const payout = service['calculatePayout'](reels, betAmount);
      expect(payout).toBe(0);
    });

    it('should return 0 for lemon_lemon_cherry (2 lemons do not win)', () => {
      const reels: [string, string, string] = ['lemon', 'lemon', 'cherry'];
      const betAmount = 1.0;
      const payout = service['calculatePayout'](reels, betAmount);
      expect(payout).toBe(0);
    });

    it('should multiply payout by bet amount correctly', () => {
      const reels: [string, string, string] = ['cherry', 'cherry', 'cherry'];
      const betAmount = 5.0;
      const payout = service['calculatePayout'](reels, betAmount);
      expect(payout).toBe(250);
    });
  });

  describe('Spin Validation', () => {
    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        countryIso2: 'US',
      });
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.spin('user-1', 'game-1', 1.0),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.spin('user-1', 'game-1', 1.0),
      ).rejects.toThrow('User not found.');
    });

    it('should throw NotFoundException when game not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        balance: '100.00',
        countryIso2: 'US',
      });
      mockPrismaService.game.findUnique.mockResolvedValue(null);

      await expect(
        service.spin('user-1', 'game-1', 1.0),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.spin('user-1', 'game-1', 1.0),
      ).rejects.toThrow('Game not found.');
    });

    it('should throw BadRequestException when balance insufficient', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        balance: '0.50',
        countryIso2: 'US',
      });
      mockPrismaService.game.findUnique.mockResolvedValue({
        id: 'game-1',
        isActive: true,
        gameCountries: [{ countryIso2: 'US' }],
      });

      await expect(
        service.spin('user-1', 'game-1', 1.0),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.spin('user-1', 'game-1', 1.0),
      ).rejects.toThrow('Insufficient balance');
    });

    it('should throw NotFoundException when game not available in user country', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        balance: '100.00',
        countryIso2: 'FR',
      });
      mockPrismaService.game.findUnique.mockResolvedValue({
        id: 'game-1',
        isActive: true,
        gameCountries: [],
      });

      await expect(
        service.spin('user-1', 'game-1', 1.0),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Reel Result Key', () => {
    it('should generate correct reel result key', () => {
      const reels: [string, string, string] = ['cherry', 'lemon', 'apple'];
      const key = service['getReelResultKey'](reels);
      expect(key).toBe('cherry_lemon_apple');
    });
  });

  describe('spin', () => {
    it('should successfully spin with winning combination and update balance', async () => {
      const userId = 'user-1';
      const gameId = 'game-1';
      const betAmount = 1.0;

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        balance: '100.00',
        countryIso2: 'US',
      });

      mockPrismaService.game.findUnique.mockResolvedValue({
        id: gameId,
        isActive: true,
        gameCountries: [{ countryIso2: 'US' }],
      });

      const mockSpinHistory = {
        id: 'spin-1',
        userId,
        gameId,
        reelResultKey: 'cherry_cherry_cherry',
        amount: '49.00',
        balanceBefore: '100.00',
        balanceAfter: '149.00',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          user: {
            update: jest.fn().mockResolvedValue({}),
          },
          spinHistory: {
            create: jest.fn().mockResolvedValue(mockSpinHistory),
          },
        });
      });

      jest.spyOn(service as any, 'spinReels').mockReturnValue(['cherry', 'cherry', 'cherry']);

      const result = await service.spin(userId, gameId, betAmount);

      expect(result).toEqual({
        id: 'spin-1',
        reels: {
          reel1: 'cherry',
          reel2: 'cherry',
          reel3: 'cherry',
        },
        amount: '49.00',
        balanceBefore: '100.00',
        balanceAfter: '149.00',
        timestamp: new Date('2024-01-01T00:00:00Z'),
      });
    });

    it('should successfully spin with losing combination and deduct bet', async () => {
      const userId = 'user-1';
      const gameId = 'game-1';
      const betAmount = 1.0;

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        balance: '100.00',
        countryIso2: 'US',
      });

      mockPrismaService.game.findUnique.mockResolvedValue({
        id: gameId,
        isActive: true,
        gameCountries: [{ countryIso2: 'US' }],
      });

      const mockSpinHistory = {
        id: 'spin-2',
        userId,
        gameId,
        reelResultKey: 'cherry_apple_banana',
        amount: '-1.00',
        balanceBefore: '100.00',
        balanceAfter: '99.00',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          user: {
            update: jest.fn().mockResolvedValue({}),
          },
          spinHistory: {
            create: jest.fn().mockResolvedValue(mockSpinHistory),
          },
        });
      });

      jest.spyOn(service as any, 'spinReels').mockReturnValue(['cherry', 'apple', 'banana']);

      const result = await service.spin(userId, gameId, betAmount);

      expect(result).toEqual({
        id: 'spin-2',
        reels: {
          reel1: 'cherry',
          reel2: 'apple',
          reel3: 'banana',
        },
        amount: '-1.00',
        balanceBefore: '100.00',
        balanceAfter: '99.00',
        timestamp: new Date('2024-01-01T00:00:00Z'),
      });
    });

    it('should call transaction with correct balance updates', async () => {
      const userId = 'user-1';
      const gameId = 'game-1';
      const betAmount = 2.0;

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        balance: '50.00',
        countryIso2: 'US',
      });

      mockPrismaService.game.findUnique.mockResolvedValue({
        id: gameId,
        isActive: true,
        gameCountries: [{ countryIso2: 'US' }],
      });

      const mockTx = {
        user: {
          update: jest.fn().mockResolvedValue({}),
        },
        spinHistory: {
          create: jest.fn().mockResolvedValue({
            id: 'spin-3',
            userId,
            gameId,
            reelResultKey: 'lemon_lemon_lemon',
            amount: '4.00',
            balanceBefore: '50.00',
            balanceAfter: '54.00',
            createdAt: new Date(),
          }),
        },
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback(mockTx);
      });

      jest.spyOn(service as any, 'spinReels').mockReturnValue(['lemon', 'lemon', 'lemon']);

      await service.spin(userId, gameId, betAmount);

      expect(mockTx.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { balance: '54.00' },
      });

      expect(mockTx.spinHistory.create).toHaveBeenCalledWith({
        data: {
          userId,
          gameId,
          reelResultKey: 'lemon_lemon_lemon',
          amount: '4.00',
          balanceBefore: '50.00',
          balanceAfter: '54.00',
        },
      });
    });

    it('should handle exact balance match for bet amount', async () => {
      const userId = 'user-1';
      const gameId = 'game-1';
      const betAmount = 10.0;

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        balance: '10.00',
        countryIso2: 'US',
      });

      mockPrismaService.game.findUnique.mockResolvedValue({
        id: gameId,
        isActive: true,
        gameCountries: [{ countryIso2: 'US' }],
      });

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          user: {
            update: jest.fn().mockResolvedValue({}),
          },
          spinHistory: {
            create: jest.fn().mockResolvedValue({
              id: 'spin-4',
              userId,
              gameId,
              reelResultKey: 'cherry_apple_lemon',
              amount: '-10.00',
              balanceBefore: '10.00',
              balanceAfter: '0.00',
              createdAt: new Date(),
            }),
          },
        });
      });

      jest.spyOn(service as any, 'spinReels').mockReturnValue(['cherry', 'apple', 'lemon']);

      const result = await service.spin(userId, gameId, betAmount);

      expect(result.balanceAfter).toBe('0.00');
    });

    it('should throw NotFoundException when game is inactive', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        balance: '100.00',
        countryIso2: 'US',
      });

      mockPrismaService.game.findUnique.mockResolvedValue({
        id: 'game-1',
        isActive: false,
        gameCountries: [{ countryIso2: 'US' }],
      });

      await expect(
        service.spin('user-1', 'game-1', 1.0),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getHistory', () => {
    it('should return empty array when user has no history', async () => {
      mockPrismaService.spinHistory.findMany.mockResolvedValue([]);

      const result = await service.getHistory('user-1');

      expect(result).toEqual([]);
      expect(mockPrismaService.spinHistory.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          game: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      });
    });

    it('should return formatted history with default limit of 10', async () => {
      const mockHistory = [
        {
          id: 'spin-1',
          userId: 'user-1',
          gameId: 'game-1',
          reelResultKey: 'cherry_cherry_cherry',
          amount: '49.00',
          balanceBefore: '100.00',
          balanceAfter: '149.00',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          game: {
            title: 'Slot Machine',
            slug: 'slot-machine',
          },
        },
        {
          id: 'spin-2',
          userId: 'user-1',
          gameId: 'game-1',
          reelResultKey: 'lemon_apple_banana',
          amount: '-1.00',
          balanceBefore: '149.00',
          balanceAfter: '148.00',
          createdAt: new Date('2024-01-01T09:00:00Z'),
          game: {
            title: 'Slot Machine',
            slug: 'slot-machine',
          },
        },
      ];

      mockPrismaService.spinHistory.findMany.mockResolvedValue(mockHistory);

      const result = await service.getHistory('user-1');

      expect(result).toEqual([
        {
          id: 'spin-1',
          gameTitle: 'Slot Machine',
          gameSlug: 'slot-machine',
          reels: {
            reel1: 'cherry',
            reel2: 'cherry',
            reel3: 'cherry',
          },
          netAmount: '49.00',
          balanceAfter: '149.00',
          timestamp: new Date('2024-01-01T10:00:00Z'),
        },
        {
          id: 'spin-2',
          gameTitle: 'Slot Machine',
          gameSlug: 'slot-machine',
          reels: {
            reel1: 'lemon',
            reel2: 'apple',
            reel3: 'banana',
          },
          netAmount: '-1.00',
          balanceAfter: '148.00',
          timestamp: new Date('2024-01-01T09:00:00Z'),
        },
      ]);
    });

    it('should respect custom limit parameter', async () => {
      mockPrismaService.spinHistory.findMany.mockResolvedValue([]);

      await service.getHistory('user-1', 5);

      expect(mockPrismaService.spinHistory.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          game: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      });
    });

    it('should correctly parse reel symbols from reelResultKey', async () => {
      const mockHistory = [
        {
          id: 'spin-1',
          userId: 'user-1',
          gameId: 'game-1',
          reelResultKey: 'banana_banana_banana',
          amount: '14.00',
          balanceBefore: '100.00',
          balanceAfter: '114.00',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          game: {
            title: 'Slot Machine',
            slug: 'slot-machine',
          },
        },
      ];

      mockPrismaService.spinHistory.findMany.mockResolvedValue(mockHistory);

      const result = await service.getHistory('user-1');

      expect(result[0].reels).toEqual({
        reel1: 'banana',
        reel2: 'banana',
        reel3: 'banana',
      });
    });

    it('should return history ordered by createdAt descending', async () => {
      const mockHistory = [
        {
          id: 'spin-3',
          userId: 'user-1',
          gameId: 'game-1',
          reelResultKey: 'apple_apple_apple',
          amount: '19.00',
          balanceBefore: '100.00',
          balanceAfter: '119.00',
          createdAt: new Date('2024-01-03T10:00:00Z'),
          game: {
            title: 'Slot Machine',
            slug: 'slot-machine',
          },
        },
        {
          id: 'spin-2',
          userId: 'user-1',
          gameId: 'game-1',
          reelResultKey: 'lemon_lemon_lemon',
          amount: '2.00',
          balanceBefore: '100.00',
          balanceAfter: '102.00',
          createdAt: new Date('2024-01-02T10:00:00Z'),
          game: {
            title: 'Slot Machine',
            slug: 'slot-machine',
          },
        },
      ];

      mockPrismaService.spinHistory.findMany.mockResolvedValue(mockHistory);

      const result = await service.getHistory('user-1');

      expect(result[0].id).toBe('spin-3');
      expect(result[1].id).toBe('spin-2');
      expect(mockPrismaService.spinHistory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        }),
      );
    });
  });
});
