import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SlotsService } from './slots.service';
import { SpinDto } from './dto/spin.dto';
import { HistoryQueryDto } from './dto/history-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('slots')
@UseGuards(JwtAuthGuard)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('spin')
  async spin(@Body() spinDto: SpinDto, @Request() req) {
    return this.slotsService.spin(
      req.user.userId,
      spinDto.gameId,
      spinDto.betAmount,
    );
  }

  @Get('history')
  async getHistory(@Query() query: HistoryQueryDto, @Request() req) {
    return this.slotsService.getHistory(req.user.userId, query.limit);
  }
}
