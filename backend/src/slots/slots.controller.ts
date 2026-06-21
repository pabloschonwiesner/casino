import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SlotsService } from './slots.service';
import { SpinDto } from './dto/spin.dto';
import { HistoryQueryDto } from './dto/history-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Slots')
@ApiCookieAuth('access_token')
@Controller('slots')
@UseGuards(JwtAuthGuard)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @ApiOperation({ summary: 'Spin the slot machine' })
  @ApiBody({ type: SpinDto })
  @ApiResponse({ status: 200, description: 'Spin successful. Returns reels, payout, and updated balance.' })
  @ApiResponse({ status: 400, description: 'Insufficient balance or invalid game.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Game not found or not available in user country.' })
  @ApiResponse({ status: 429, description: 'Too many requests. Rate limit: 20 requests per minute.' })
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('spin')
  async spin(@Body() spinDto: SpinDto, @Request() req) {
    return this.slotsService.spin(
      req.user.userId,
      spinDto.gameId,
      spinDto.betAmount,
    );
  }

  @ApiOperation({ summary: 'Get spin history' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of recent spins to return (default: 10)' })
  @ApiResponse({ status: 200, description: 'Returns recent spin history.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('history')
  async getHistory(@Query() query: HistoryQueryDto, @Request() req) {
    return this.slotsService.getHistory(req.user.userId, query.limit);
  }
}
