import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryGamesDto } from './dto/query-games.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryGamesDto, userId?: string) {
    const { q, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    let userCountry: string | null = null;
    const favoriteGameIds = new Set<string>();

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { countryIso2: true },
      });
      userCountry = user?.countryIso2 || null;

      const favorites = await this.prisma.userFavoriteGame.findMany({
        where: { userId },
        select: { gameId: true },
      });
      favorites.forEach((fav) => favoriteGameIds.add(fav.gameId));
    }

    const whereClause: any = {
      isActive: true,
    };

    if (userCountry) {
      whereClause.gameCountries = {
        some: {
          countryIso2: userCountry,
        },
      };
    }

    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { providerName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [games, total] = await Promise.all([
      this.prisma.game.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          gameType: {
            select: {
              code: true,
              name: true,
            },
          },
        },
        orderBy: userId
          ? [{ title: 'asc' }]
          : [{ title: 'asc' }],
      }),
      this.prisma.game.count({ where: whereClause }),
    ]);

    const sortedGames = userId
      ? [
          ...games.filter((g) => favoriteGameIds.has(g.id)),
          ...games.filter((g) => !favoriteGameIds.has(g.id)),
        ]
      : games;

    const data = sortedGames.map((game) => ({
      id: game.id,
      slug: game.slug,
      title: game.title,
      providerName: game.providerName,
      thumbnailUrl: game.thumbnailUrl,
      gameType: game.gameType,
      isFavorite: favoriteGameIds.has(game.id),
    }));

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(slug: string, userId?: string) {
    let userCountry: string | null = null;

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { countryIso2: true },
      });
      userCountry = user?.countryIso2 || null;
    }

    const game = await this.prisma.game.findUnique({
      where: { slug },
      include: {
        gameType: {
          select: {
            code: true,
            name: true,
          },
        },
        gameCountries: userCountry
          ? {
              where: {
                countryIso2: userCountry,
              },
              select: {
                countryIso2: true,
              },
            }
          : false,
        userFavoriteGames: userId
          ? {
              where: {
                userId,
              },
              select: {
                userId: true,
              },
            }
          : false,
      },
    });

    if (!game) {
      return null;
    }

    if (userCountry && game.gameCountries.length === 0) {
      throw new ForbiddenException('This game is not available in your country.');
    }

    const isFavorite = userId ? game.userFavoriteGames.length > 0 : false;

    return {
      id: game.id,
      slug: game.slug,
      title: game.title,
      providerName: game.providerName,
      thumbnailUrl: game.thumbnailUrl,
      startUrl: game.startUrl,
      gameType: game.gameType,
      isFavorite,
    };
  }
}
