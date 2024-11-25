import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    connection = moduleFixture.get<Connection>(getConnectionToken());
    const collections = connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

    await app.init();
  }, 10000);

  afterEach(async () => {
    const collections = connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await app.close();
    await connection.close();
  });

  describe('register flow', () => {
    const validUser = {
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(validUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.email).toBe(validUser.email);
          expect(res.body.full_name).toBe(validUser.full_name);
        });
    });
    ``;

    it('should fail when registering with invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...validUser, email: 'invalid-email' })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email must be an email');
        });
    });

    it('should fail when registering with short password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ ...validUser, password: '12345' })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'password must be longer than or equal to 6 characters',
          );
        });
    });

    it('should fail when registering with missing required fields', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400);
    });

    it('should fail when registering with existing email', async () => {
      await request(app.getHttpServer()).post('/auth/register').send(validUser);

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(validUser)
        .expect(400);
    });
  });

  describe('login flow', () => {
    const validUser = {
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    beforeEach(async () => {
      await request(app.getHttpServer()).post('/auth/register').send(validUser);
    });

    it('should login successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: validUser.email,
          password: validUser.password,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.user).toHaveProperty('_id');
          expect(res.body.user.email).toBe(validUser.email);
          expect(res.body.user).not.toHaveProperty('password');
          expect(res.body).toHaveProperty('token');
        });
    });

    it('should fail when logging in with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: validUser.password,
        })
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toBe('User not found');
        });
    });

    it('should fail when logging in with incorrect password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: validUser.email,
          password: 'wrongpassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Invalid password');
        });
    });

    it('should fail when logging in with invalid email format', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: validUser.password,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email must be an email');
        });
    });

    it('should fail when logging in with missing credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });
  });
});
