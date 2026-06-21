import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MassiveForexAdapter } from './adapters/massive-forex.adapter';
import { FOREX_ADAPTER } from './adapters/forex-adapter.token';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [CurrenciesController],
  providers: [
    CurrenciesService,
    {
      provide: FOREX_ADAPTER,
      useClass: MassiveForexAdapter,
    },
  ],
})
export class CurrenciesModule {}
