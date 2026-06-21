import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { QueryGamesDto } from './dto/query-games.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOperation({ summary: 'Get game catalog with search and pagination' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by title or provider' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20)' })
  @ApiResponse({ status: 200, description: 'Returns paginated game list with favorite status if authenticated.' })
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(@Query() query: QueryGamesDto, @Request() req) {
    const userId = req.user?.userId;
    return this.gamesService.findAll(query, userId);
  }

  @ApiOperation({ summary: 'Get game details by slug' })
  @ApiParam({ name: 'slug', type: String, description: 'Game slug' })
  @ApiResponse({ status: 200, description: 'Returns game details with favorite status if authenticated.' })
  @ApiResponse({ status: 403, description: 'Game not available in user country.' })
  @ApiResponse({ status: 404, description: 'Game not found.' })
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
