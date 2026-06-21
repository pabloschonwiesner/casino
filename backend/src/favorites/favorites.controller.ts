import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiParam } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Favorites')
@ApiCookieAuth('access_token')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: 'Add game to favorites' })
  @ApiParam({ name: 'gameId', type: String, description: 'Game UUID' })
  @ApiResponse({ status: 201, description: 'Game added to favorites.' })
  @ApiResponse({ status: 400, description: 'Game already in favorites or not available in user country.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Game not found.' })
  @Post(':gameId')
  async addFavorite(
    @Param('gameId', ParseUUIDPipe) gameId: string,
    @Request() req,
  ) {
    return this.favoritesService.addFavorite(req.user.userId, gameId);
  }

  @ApiOperation({ summary: 'Remove game from favorites' })
  @ApiParam({ name: 'gameId', type: String, description: 'Game UUID' })
  @ApiResponse({ status: 200, description: 'Game removed from favorites.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Favorite not found.' })
  @Delete(':gameId')
  async removeFavorite(
    @Param('gameId', ParseUUIDPipe) gameId: string,
    @Request() req,
  ) {
    return this.favoritesService.removeFavorite(req.user.userId, gameId);
  }
}
