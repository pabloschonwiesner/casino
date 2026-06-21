import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth E2E', () => {
  let app: INestApplication;
  let authCookie: string;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', () => {
      const timestamp = Date.now();
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `test${timestamp}@example.com`,
          password: 'Password123!',
          countryIso2: 'US',
          preferredCurrencyCode: 'USD',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toBe(`test${timestamp}@example.com`);
          expect(res.body.user.balance).toBe('1000.00');
          expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    it('should reject registration with existing email', async () => {
      const timestamp = Date.now();
      const email = `duplicate${timestamp}@example.com`;

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password: 'Password123!',
          countryIso2: 'US',
          preferredCurrencyCode: 'USD',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password: 'Password123!',
          countryIso2: 'US',
          preferredCurrencyCode: 'USD',
        })
        .expect(400);
    });

    it('should reject registration with invalid data', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: '123',
          countryIso2: 'INVALID',
        })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      const timestamp = Date.now();
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `logintest${timestamp}@example.com`,
          password: 'Password123!',
          countryIso2: 'US',
          preferredCurrencyCode: 'USD',
        });
    });

    it('should login with valid credentials', async () => {
      const timestamp = Date.now();
      const email = `login${timestamp}@example.com`;

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password: 'Password123!',
          countryIso2: 'US',
          preferredCurrencyCode: 'USD',
        });

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password: 'Password123!',
        })
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(email);
      expect(response.headers['set-cookie']).toBeDefined();
      authCookie = response.headers['set-cookie'][0];
    });

    it('should reject login with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
        .expect(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user with valid cookie', async () => {
      const timestamp = Date.now();
      const email = `metest${timestamp}@example.com`;

      const registerRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password: 'Password123!',
          countryIso2: 'US',
          preferredCurrencyCode: 'USD',
        });

      const cookie = registerRes.headers['set-cookie'][0];

      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', cookie)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(email);
          expect(res.body.balance).toBeDefined();
        });
    });

    it('should reject request without cookie', () => {
      return request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout and clear cookie', async () => {
      const timestamp = Date.now();
      const email = `logouttest${timestamp}@example.com`;

      const registerRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email,
          password: 'Password123!',
          countryIso2: 'US',
          preferredCurrencyCode: 'USD',
        });

      const cookie = registerRes.headers['set-cookie'][0];

      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', cookie)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Logged out successfully');
        });
    });
  });
});
