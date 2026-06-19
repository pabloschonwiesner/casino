import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  async getCountries() {
    const countries = await this.prisma.country.findMany({
      include: {
        currency: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      data: countries.map((country) => ({
        iso2: country.iso2,
        iso3: country.iso3,
        name: country.name,
        flagUrl: country.flagUrl,
        currencyCode: country.currencyCode,
      })),
    };
  }
}
