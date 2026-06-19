import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface GameData {
  id: string;
  externalId: string;
  slug: string;
  title: string;
  providerName: string;
  thumb: { url: string | null } | null;
  startUrl: string | null;
}

async function main() {
  console.log('Starting database seed...');

  await seedCurrencies();
  await seedCountries();
  await seedGameTypes();
  await seedGames();
  await seedGameAvailability();

  console.log('Database seed completed successfully!');
}

async function seedCurrencies() {
  console.log('Seeding currencies...');

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2 },
    { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2 },
    { code: 'GBP', name: 'British Pound', symbol: '£', decimalPlaces: 2 },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$', decimalPlaces: 2 },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimalPlaces: 2 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimalPlaces: 2 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimalPlaces: 0 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimalPlaces: 2 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimalPlaces: 2 },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimalPlaces: 2 },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    });
  }

  console.log(`Seeded ${currencies.length} currencies`);
}

async function seedCountries() {
  console.log('Seeding countries...');

  const countries = [
    {
      iso2: 'MT',
      iso3: 'MLT',
      name: 'Malta',
      flagUrl: 'https://flagcdn.com/mt.svg',
      currencyCode: 'EUR',
    },
    {
      iso2: 'GB',
      iso3: 'GBR',
      name: 'United Kingdom',
      flagUrl: 'https://flagcdn.com/gb.svg',
      currencyCode: 'GBP',
    },
    {
      iso2: 'US',
      iso3: 'USA',
      name: 'United States',
      flagUrl: 'https://flagcdn.com/us.svg',
      currencyCode: 'USD',
    },
    {
      iso2: 'AR',
      iso3: 'ARG',
      name: 'Argentina',
      flagUrl: 'https://flagcdn.com/ar.svg',
      currencyCode: 'ARS',
    },
    {
      iso2: 'BR',
      iso3: 'BRA',
      name: 'Brazil',
      flagUrl: 'https://flagcdn.com/br.svg',
      currencyCode: 'BRL',
    },
    {
      iso2: 'CA',
      iso3: 'CAN',
      name: 'Canada',
      flagUrl: 'https://flagcdn.com/ca.svg',
      currencyCode: 'CAD',
    },
    {
      iso2: 'JP',
      iso3: 'JPN',
      name: 'Japan',
      flagUrl: 'https://flagcdn.com/jp.svg',
      currencyCode: 'JPY',
    },
    {
      iso2: 'AU',
      iso3: 'AUS',
      name: 'Australia',
      flagUrl: 'https://flagcdn.com/au.svg',
      currencyCode: 'AUD',
    },
    {
      iso2: 'CH',
      iso3: 'CHE',
      name: 'Switzerland',
      flagUrl: 'https://flagcdn.com/ch.svg',
      currencyCode: 'CHF',
    },
    {
      iso2: 'MX',
      iso3: 'MEX',
      name: 'Mexico',
      flagUrl: 'https://flagcdn.com/mx.svg',
      currencyCode: 'MXN',
    },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: { iso2: country.iso2 },
      update: {},
      create: country,
    });
  }

  console.log(`Seeded ${countries.length} countries`);
}

async function seedGameTypes() {
  console.log('Seeding game types...');

  const gameTypes = [
    {
      code: 'slot',
      name: 'Slot',
    },
  ];

  for (const gameType of gameTypes) {
    await prisma.gameType.upsert({
      where: { code: gameType.code },
      update: {},
      create: gameType,
    });
  }

  console.log(`Seeded ${gameTypes.length} game types`);
}

async function seedGames() {
  console.log('Seeding games from game-data.json...');

  const gameDataPath = path.join(__dirname, 'game-data.json');
  const gameDataJson = fs.readFileSync(gameDataPath, 'utf-8');
  const gameData: GameData[] = JSON.parse(gameDataJson);
  
  const slotGameType = await prisma.gameType.findUnique({
    where: { code: 'slot' },
  });

  if (!slotGameType) {
    throw new Error('Slot game type not found');
  }

  for (const game of gameData) {
    const slug = game.slug;

    await prisma.game.upsert({
      where: { externalId: game.id },
      update: {},
      create: {
        externalId: game.id,
        slug: slug,
        title: game.title,
        providerName: game.providerName,
        thumbnailUrl: game.thumb?.url,
        startUrl: game.startUrl,
        gameTypeId: slotGameType.id,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${gameData.length} games`);
}

async function seedGameAvailability() {
  console.log('Seeding game availability...');

  const games = await prisma.game.findMany({
    where: { isActive: true },
  });

  const countries = await prisma.country.findMany();

  let availabilityCount = 0;

  for (const game of games) {
    for (const country of countries) {
      await prisma.gameCountry.upsert({
        where: {
          gameId_countryIso2: {
            gameId: game.id,
            countryIso2: country.iso2,
          },
        },
        update: {},
        create: {
          gameId: game.id,
          countryIso2: country.iso2,
        },
      });
      availabilityCount++;
    }
  }

  console.log(`Seeded ${availabilityCount} game availability records`);
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
