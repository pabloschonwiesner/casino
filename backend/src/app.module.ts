import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [PrismaModule, AuthModule, CountriesModule, GamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
