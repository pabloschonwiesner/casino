import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { QueryGamesDto } from './dto/query-games.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(@Query() query: QueryGamesDto, @Request() req) {
    const userId = req.user?.userId;
    return this.gamesService.findAll(query, userId);
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param('slug') slug: string, @Request() req) {
    const userId = req.user?.userId;
    const game = await this.gamesService.findOne(slug, userId);
    
    if (!game) {
      throw new NotFoundException('Game not found.');
    }
    
    return game;
  }
}
