import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addFavorite(userId: string, gameId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { countryIso2: true },
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

    await this.prisma.userFavoriteGame.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
      create: {
        userId,
        gameId,
      },
      update: {},
    });

    return {
      gameId,
      isFavorite: true,
    };
  }

  async removeFavorite(userId: string, gameId: string) {
    await this.prisma.userFavoriteGame.deleteMany({
      where: {
        userId,
        gameId,
      },
    });

    return {
      gameId,
      isFavorite: false,
    };
  }
}
