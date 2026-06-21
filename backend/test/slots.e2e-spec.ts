import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Slots E2E', () => {
  let app: INestApplication;
  let authCookie: string;
  let gameId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const timestamp = Date.now();
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `slotstest${timestamp}@example.com`,
        password: 'Password123!',
        countryIso2: 'US',
        preferredCurrencyCode: 'USD',
      });

    authCookie = registerRes.headers['set-cookie'][0];

    const gamesRes = await request(app.getHttpServer())
      .get('/games')
      .set('Cookie', authCookie);

    gameId = gamesRes.body.games[0]?.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /slots/spin', () => {
    it('should spin and persist result (win or loss)', async () => {
      const spinRes = await request(app.getHttpServer())
        .post('/slots/spin')
        .set('Cookie', authCookie)
        .send({
          gameId,
          betAmount: 1.0,
        })
        .expect(200);

      expect(spinRes.body.id).toBeDefined();
      expect(spinRes.body.reels).toBeDefined();
      expect(spinRes.body.reels.reel1).toBeDefined();
      expect(spinRes.body.reels.reel2).toBeDefined();
      expect(spinRes.body.reels.reel3).toBeDefined();
      expect(spinRes.body.amount).toBeDefined();
      expect(spinRes.body.balanceBefore).toBeDefined();
      expect(spinRes.body.balanceAfter).toBeDefined();

      const historyRes = await request(app.getHttpServer())
        .get('/slots/history')
        .set('Cookie', authCookie)
        .expect(200);

      expect(historyRes.body.length).toBeGreaterThan(0);
      expect(historyRes.body[0].id).toBe(spinRes.body.id);
      expect(historyRes.body[0].reelResultKey).toBeDefined();
    });

    it('should reject spin without authentication', () => {
      return request(app.getHttpServer())
        .post('/slots/spin')
        .send({
          gameId,
          betAmount: 1.0,
        })
        .expect(401);
    });

    it('should reject spin with insufficient balance', async () => {
      return request(app.getHttpServer())
        .post('/slots/spin')
        .set('Cookie', authCookie)
        .send({
          gameId,
          betAmount: 10000.0,
        })
        .expect(400);
    });

    it('should reject spin with invalid bet amount', () => {
      return request(app.getHttpServer())
        .post('/slots/spin')
        .set('Cookie', authCookie)
        .send({
          gameId,
          betAmount: -1.0,
        })
        .expect(400);
    });
  });

  describe('GET /slots/history', () => {
    it('should return spin history', () => {
      return request(app.getHttpServer())
        .get('/slots/history')
        .set('Cookie', authCookie)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should limit history results', () => {
      return request(app.getHttpServer())
        .get('/slots/history?limit=5')
        .set('Cookie', authCookie)
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeLessThanOrEqual(5);
        });
    });

    it('should reject history request without authentication', () => {
      return request(app.getHttpServer()).get('/slots/history').expect(401);
    });
  });
});
