import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { UserRole } from '../src/users/enums/users.enums';
import { JwtService } from '@nestjs/jwt';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let jwtService: JwtService;
  let adminToken: string;
  let userToken: string;
  let movieId: string;

  const mockMovie = {
    title: 'A New Hope',
    episode_id: 4,
    opening_crawl: 'It is a period of civil war...',
    director: 'George Lucas',
    producer: 'Gary Kurtz',
    release_date: '1977-05-25',
    characters: ['Luke Skywalker', 'Darth Vader'],
    planets: ['Tatooine', 'Alderaan'],
    starships: ['X-wing', 'TIE Fighter'],
    vehicles: ['Snowspeeder'],
    species: ['Human', 'Droid'],
  };

  const mockUpdateMovie = {
    title: 'A New Hope - Special Edition',
    director: 'George Lucas - Updated',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = moduleFixture.get(getConnectionToken());
    jwtService = moduleFixture.get<JwtService>(JwtService);

    adminToken = jwtService.sign({ role: UserRole.ADMIN });
    userToken = jwtService.sign({ role: UserRole.REGULAR });

    await app.init();
  });

  beforeEach(async () => {
    const collections = connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  describe('Creation flow', () => {
    it('should create a movie when user is admin', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockMovie)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.title).toBe(mockMovie.title);
          movieId = res.body._id;
        });
    });

    it('should fail to create movie when user is not admin', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${userToken}`)
        .send(mockMovie)
        .expect(403);
    });

    it('should fail without authorization token', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send(mockMovie)
        .expect(401);
    });

    it('should fail with invalid movie data', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 123 })
        .expect(400);
    });

    it('should fail when movie with same episode_id exists', async () => {
      await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockMovie);

      return request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockMovie)
        .expect(400);
    });
  });

  describe('Read flow', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockMovie);
      movieId = response.body._id;
    });

    it('should get all movies with valid token', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBe(1);
          expect(res.body[0].title).toBe(mockMovie.title);
        });
    });

    it('should fail without authorization token', () => {
      return request(app.getHttpServer()).get('/movies').expect(401);
    });
  });

  describe('Single movie flow', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockMovie);
      movieId = response.body._id;
    });

    it('should get movie by id with valid token', () => {
      return request(app.getHttpServer())
        .get(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe(mockMovie.title);
          expect(res.body._id).toBe(movieId);
        });
    });

    it('should fail without authorization token', () => {
      return request(app.getHttpServer()).get(`/movies/${movieId}`).expect(401);
    });
  });

  describe('Update flow', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockMovie);
      movieId = response.body._id;
    });

    it('should update movie when user is admin', () => {
      return request(app.getHttpServer())
        .patch(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockUpdateMovie)
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe(mockUpdateMovie.title);
          expect(res.body.director).toBe(mockUpdateMovie.director);
        });
    });

    it('should fail to update when user is not admin', () => {
      return request(app.getHttpServer())
        .patch(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(mockUpdateMovie)
        .expect(403);
    });

    it('should fail without authorization token', () => {
      return request(app.getHttpServer())
        .patch(`/movies/${movieId}`)
        .send(mockUpdateMovie)
        .expect(401);
    });
  });

  describe('Delete flow', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockMovie);
      movieId = response.body._id;
    });

    it('should delete movie when user is admin', () => {
      return request(app.getHttpServer())
        .delete(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toContain('deleted successfully');
        });
    });

    it('should fail to delete when user is not admin', () => {
      return request(app.getHttpServer())
        .delete(`/movies/${movieId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should fail without authorization token', () => {
      return request(app.getHttpServer())
        .delete(`/movies/${movieId}`)
        .expect(401);
    });
  });

  describe('Sincronize flow', () => {
    it('should sync movies when user is admin', async () => {
      return request(app.getHttpServer())
        .post('/movies/sincronize')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toMatch(
            /(Successfully synced|No new movies)/,
          );
        });
    }, 100000);

    it('should fail to sync when user is not admin', () => {
      return request(app.getHttpServer())
        .post('/movies/sincronize')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should fail without authorization token', () => {
      return request(app.getHttpServer())
        .post('/movies/sincronize')
        .expect(401);
    });
  });
});
