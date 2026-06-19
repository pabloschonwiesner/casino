import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':gameId')
  async addFavorite(
    @Param('gameId', ParseUUIDPipe) gameId: string,
    @Request() req,
  ) {
    return this.favoritesService.addFavorite(req.user.userId, gameId);
  }

  @Delete(':gameId')
  async removeFavorite(
    @Param('gameId', ParseUUIDPipe) gameId: string,
    @Request() req,
  ) {
    return this.favoritesService.removeFavorite(req.user.userId, gameId);
  }
}
