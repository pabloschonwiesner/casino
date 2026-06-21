import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CountriesService } from './countries.service';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private countriesService: CountriesService) {}

  @ApiOperation({ summary: 'Get list of available countries' })
  @ApiResponse({ status: 200, description: 'Returns list of countries with ISO2 code and name.' })
  @Get()
  async getCountries() {
    return this.countriesService.getCountries();
  }
}
