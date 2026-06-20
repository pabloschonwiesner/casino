import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DecimalUtils } from '../common/utils/decimal.utils';

const SLOT_REELS = [
  ['cherry', 'lemon', 'apple', 'lemon', 'banana', 'banana', 'lemon', 'lemon'],
  ['lemon', 'apple', 'lemon', 'lemon', 'cherry', 'apple', 'banana', 'lemon'],
  ['lemon', 'apple', 'lemon', 'apple', 'cherry', 'lemon', 'banana', 'lemon'],
];

const PAYTABLE: Record<string, number> = {
  'cherry_cherry_cherry': 50,
  'cherry_cherry_lemon': 40,
  'cherry_cherry_apple': 40,
  'cherry_cherry_banana': 40,
  'apple_apple_apple': 20,
  'apple_apple_lemon': 10,
  'apple_apple_cherry': 10,
  'apple_apple_banana': 10,
  'banana_banana_banana': 15,
  'banana_banana_lemon': 5,
  'banana_banana_cherry': 5,
  'banana_banana_apple': 5,
  'lemon_lemon_lemon': 3,
};

@Injectable()
export class SlotsService {
  constructor(private prisma: PrismaService) {}

  private spinReels(): [string, string, string] {
    return [
      SLOT_REELS[0][Math.floor(Math.random() * SLOT_REELS[0].length)],
      SLOT_REELS[1][Math.floor(Math.random() * SLOT_REELS[1].length)],
      SLOT_REELS[2][Math.floor(Math.random() * SLOT_REELS[2].length)],
    ];
  }

  private calculatePayout(reels: [string, string, string], betAmount: number): number {
    const reelKey = this.getReelResultKey(reels);
    const multiplier = PAYTABLE[reelKey];
    
    if (multiplier) {
      return betAmount * multiplier;
    }

    return 0;
  }

  private getReelResultKey(reels: [string, string, string]): string {
    return reels.join('_');
  }

  async spin(userId: string, gameId: string, betAmount: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true, countryIso2: true },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        gameCountries: {
          where: {
            countryIso2: user.countryIso2,
          },
        },
      },
    });

    if (!game || !game.isActive || game.gameCountries.length === 0) {
      throw new NotFoundException('Game not found.');
    }

    const balanceBefore = DecimalUtils.parseDecimal(user.balance.toString());

    if (DecimalUtils.lessThan(balanceBefore, betAmount)) {
      throw new BadRequestException('Insufficient balance.');
    }

    const reels = this.spinReels();
    const winningAmount = this.calculatePayout(reels, betAmount);
    const netAmount = DecimalUtils.subtract(winningAmount, betAmount);
    const balanceAfter = DecimalUtils.add(balanceBefore, netAmount);

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: DecimalUtils.toFixed2(balanceAfter) },
      });

      const spinHistory = await tx.spinHistory.create({
        data: {
          userId,
          gameId,
          reelResultKey: this.getReelResultKey(reels),
          amount: DecimalUtils.toFixed2(netAmount),
          balanceBefore: DecimalUtils.toFixed2(balanceBefore),
          balanceAfter: DecimalUtils.toFixed2(balanceAfter),
        },
      });

      return spinHistory;
    });

    return {
      id: result.id,
      reels: {
        reel1: result.reelResultKey.split('_')[0],
        reel2: result.reelResultKey.split('_')[1],
        reel3: result.reelResultKey.split('_')[2],
      },
      amount: result.amount.toString(),
      balanceBefore: result.balanceBefore.toString(),
      balanceAfter: result.balanceAfter.toString(),
      timestamp: result.createdAt,
    };
  }

  async getHistory(userId: string, limit: number = 10) {
    const history = await this.prisma.spinHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        game: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return history.map((spin) => {
      const reelSymbols = spin.reelResultKey.split('_');
      return {
        id: spin.id,
        gameTitle: spin.game.title,
        gameSlug: spin.game.slug,
        reels: {
          reel1: reelSymbols[0],
          reel2: reelSymbols[1],
          reel3: reelSymbols[2],
        },
        netAmount: spin.amount.toString(),
        balanceAfter: spin.balanceAfter.toString(),
        timestamp: spin.createdAt,
      };
    });
  }
}
