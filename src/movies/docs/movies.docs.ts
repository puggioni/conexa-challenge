import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBody,
} from '@nestjs/swagger';

export const SyncMoviesDocs = () => {
  return applyDecorators(
    ApiTags('Movies'),
    ApiOperation({
      summary: 'Synchronize movies from SWAPI',
      description:
        'Fetches movies from Star Wars API (SWAPI) and stores them in the database. Only new movies that do not exist in the database will be synchronized.',
    }),
    ApiResponse({
      status: 200,
      description: 'Synchronization response',
      schema: {
        oneOf: [
          {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Successfully synced 3 new movies',
              },
              syncedMovies: {
                type: 'array',
                items: {
                  type: 'string',
                },
                example: [
                  'A New Hope',
                  'The Empire Strikes Back',
                  'Return of the Jedi',
                ],
              },
            },
          },
          {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'No new movies to sync',
              },
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - JWT token is missing or invalid',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - User does not have admin privileges',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 500,
          },
          message: {
            type: 'string',
            example: 'Error syncing movies: Network error',
          },
          error: {
            type: 'string',
            example: 'Internal Server Error',
          },
        },
      },
    }),
  );
};

export const CreateMovieDocs = () => {
  return applyDecorators(
    ApiTags('Movies'),
    ApiOperation({
      summary: 'Create a new movie',
      description: 'Creates a new movie entry in the database.',
    }),
    ApiBody({
      description: 'Movie creation payload',
      schema: {
        type: 'object',
        required: [
          'title',
          'episode_id',
          'director',
          'producer',
          'release_date',
        ],
        properties: {
          title: {
            type: 'string',
            example: 'A New Hope',
            description: 'The title of the movie',
          },
          episode_id: {
            type: 'number',
            example: 4,
            description: 'The episode number',
          },
          opening_crawl: {
            type: 'string',
            example: 'It is a period of civil war...',
            description:
              'The opening text that crawls up at the beginning of the movie',
          },
          director: {
            type: 'string',
            example: 'George Lucas',
            description: 'The director of the movie',
          },
          producer: {
            type: 'string',
            example: 'Gary Kurtz',
            description: 'The producer of the movie',
          },
          release_date: {
            type: 'string',
            format: 'date',
            example: '1977-05-25',
            description: 'The release date of the movie (YYYY-MM-DD)',
          },
          characters: {
            type: 'array',
            items: { type: 'string' },
            example: ['Luke Skywalker', 'Darth Vader', 'Princess Leia'],
            description: 'List of characters appearing in the movie',
          },
          planets: {
            type: 'array',
            items: { type: 'string' },
            example: ['Tatooine', 'Alderaan', 'Hoth'],
            description: 'List of planets featured in the movie',
          },
          starships: {
            type: 'array',
            items: { type: 'string' },
            example: ['X-wing', 'TIE Fighter', 'Millennium Falcon'],
            description: 'List of starships featured in the movie',
          },
          vehicles: {
            type: 'array',
            items: { type: 'string' },
            example: ['Snowspeeder', 'AT-AT'],
            description: 'List of vehicles featured in the movie',
          },
          species: {
            type: 'array',
            items: { type: 'string' },
            example: ['Human', 'Droid', 'Wookie'],
            description: 'List of species featured in the movie',
          },
        },
      },
      examples: {
        movie: {
          summary: 'Sample Movie',
          description: 'A sample movie creation request',
          value: {
            title: 'A New Hope',
            episode_id: 4,
            opening_crawl: 'It is a period of civil war...',
            director: 'George Lucas',
            producer: 'Gary Kurtz',
            release_date: '1977-05-25',
            characters: ['Luke Skywalker', 'Darth Vader', 'Princess Leia'],
            planets: ['Tatooine', 'Alderaan', 'Hoth'],
            starships: ['X-wing', 'TIE Fighter', 'Millennium Falcon'],
            vehicles: ['Snowspeeder', 'AT-AT'],
            species: ['Human', 'Droid', 'Wookie'],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Movie created successfully',
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'A New Hope' },
          episode_id: { type: 'number', example: 4 },
          opening_crawl: {
            type: 'string',
            example: 'It is a period of civil war...',
          },
          director: { type: 'string', example: 'George Lucas' },
          producer: { type: 'string', example: 'Gary Kurtz' },
          release_date: {
            type: 'string',
            format: 'date',
            example: '1977-05-25',
          },
          characters: {
            type: 'array',
            items: { type: 'string' },
            example: ['Luke Skywalker'],
          },
          planets: {
            type: 'array',
            items: { type: 'string' },
            example: ['Tatooine'],
          },
          starships: {
            type: 'array',
            items: { type: 'string' },
            example: ['X-wing'],
          },
          vehicles: {
            type: 'array',
            items: { type: 'string' },
            example: ['Snowspeeder'],
          },
          species: {
            type: 'array',
            items: { type: 'string' },
            example: ['Human'],
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Movie already exists or invalid data',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Movie with episode_id 4 already exists',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - JWT token is missing or invalid',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - User does not have admin privileges',
    }),
  );
};

export const FindAllMoviesDocs = () => {
  return applyDecorators(
    ApiTags('Movies'),
    ApiOperation({
      summary: 'Get all movies',
      description: 'Retrieves all movies from the database.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of all movies',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'A New Hope' },
            episode_id: { type: 'number', example: 4 },
            opening_crawl: {
              type: 'string',
              example: 'It is a period of civil war...',
            },
            director: { type: 'string', example: 'George Lucas' },
            producer: { type: 'string', example: 'Gary Kurtz' },
            release_date: {
              type: 'string',
              format: 'date-time',
              example: '1977-05-25T00:00:00.000Z',
            },
            species: {
              type: 'array',
              items: { type: 'string' },
              example: ['Human', 'Droid', 'Wookie'],
            },
            starships: {
              type: 'array',
              items: { type: 'string' },
              example: ['X-wing', 'TIE Fighter', 'Millennium Falcon'],
            },
            vehicles: {
              type: 'array',
              items: { type: 'string' },
              example: ['Snowspeeder', 'AT-AT'],
            },
            characters: {
              type: 'array',
              items: { type: 'string' },
              example: ['Luke Skywalker', 'Darth Vader', 'Princess Leia'],
            },
            planets: {
              type: 'array',
              items: { type: 'string' },
              example: ['Tatooine', 'Alderaan', 'Hoth'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-20T10:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-20T10:00:00.000Z',
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - JWT token is missing or invalid',
    }),
  );
};

export const FindOneMovieDocs = () => {
  return applyDecorators(
    ApiTags('Movies'),
    ApiOperation({
      summary: 'Get movie by ID',
      description: 'Retrieves a specific movie by its ID.',
    }),
    ApiResponse({
      status: 200,
      description: 'Movie found',
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'A New Hope' },
          episode_id: { type: 'number', example: 4 },
          opening_crawl: {
            type: 'string',
            example: 'It is a period of civil war...',
          },
          director: { type: 'string', example: 'George Lucas' },
          producer: { type: 'string', example: 'Gary Kurtz' },
          release_date: {
            type: 'string',
            format: 'date-time',
            example: '1977-05-25T00:00:00.000Z',
          },
          species: {
            type: 'array',
            items: { type: 'string' },
            example: ['Human', 'Droid', 'Wookie'],
          },
          starships: {
            type: 'array',
            items: { type: 'string' },
            example: ['X-wing', 'TIE Fighter', 'Millennium Falcon'],
          },
          vehicles: {
            type: 'array',
            items: { type: 'string' },
            example: ['Snowspeeder', 'AT-AT'],
          },
          characters: {
            type: 'array',
            items: { type: 'string' },
            example: ['Luke Skywalker', 'Darth Vader', 'Princess Leia'],
          },
          planets: {
            type: 'array',
            items: { type: 'string' },
            example: ['Tatooine', 'Alderaan', 'Hoth'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T10:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T10:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Movie not found',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Movie with ID xyz not found' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - JWT token is missing or invalid',
    }),
  );
};

export const UpdateMovieDocs = () => {
  return applyDecorators(
    ApiTags('Movies'),
    ApiOperation({
      summary: 'Update movie',
      description: 'Updates an existing movie by its ID.',
    }),
    ApiBody({
      description: 'Movie update payload',
      schema: {
        type: 'object',
        required: [
          'title',
          'episode_id',
          'director',
          'producer',
          'release_date',
        ],
        properties: {
          title: {
            type: 'string',
            example: 'A New Hope',
            description: 'The title of the movie',
          },
          episode_id: {
            type: 'number',
            example: 4,
            description: 'The episode number',
          },
          opening_crawl: {
            type: 'string',
            example: 'It is a period of civil war...',
            description:
              'The opening text that crawls up at the beginning of the movie',
          },
          director: {
            type: 'string',
            example: 'George Lucas',
            description: 'The director of the movie',
          },
          producer: {
            type: 'string',
            example: 'Gary Kurtz',
            description: 'The producer of the movie',
          },
          release_date: {
            type: 'string',
            format: 'date',
            example: '1977-05-25',
            description: 'The release date of the movie (YYYY-MM-DD)',
          },
          characters: {
            type: 'array',
            items: { type: 'string' },
            example: ['Luke Skywalker', 'Darth Vader', 'Princess Leia'],
            description: 'List of characters appearing in the movie',
          },
          planets: {
            type: 'array',
            items: { type: 'string' },
            example: ['Tatooine', 'Alderaan', 'Hoth'],
            description: 'List of planets appearing in the movie',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Movie updated successfully',
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'A New Hope' },
          episode_id: { type: 'number', example: 4 },
          opening_crawl: {
            type: 'string',
            example: 'It is a period of civil war...',
          },
          director: { type: 'string', example: 'George Lucas' },
          producer: { type: 'string', example: 'Gary Kurtz' },
          release_date: {
            type: 'string',
            format: 'date-time',
            example: '1977-05-25T00:00:00.000Z',
          },
          species: {
            type: 'array',
            items: { type: 'string' },
            example: ['Human', 'Droid', 'Wookie'],
          },
          starships: {
            type: 'array',
            items: { type: 'string' },
            example: ['X-wing', 'TIE Fighter', 'Millennium Falcon'],
          },
          vehicles: {
            type: 'array',
            items: { type: 'string' },
            example: ['Snowspeeder', 'AT-AT'],
          },
          characters: {
            type: 'array',
            items: { type: 'string' },
            example: ['Luke Skywalker', 'Darth Vader', 'Princess Leia'],
          },
          planets: {
            type: 'array',
            items: { type: 'string' },
            example: ['Tatooine', 'Alderaan', 'Hoth'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T10:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-03-20T10:00:00.000Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid data provided',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Invalid data format',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Movie not found',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Movie with ID xyz not found' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - JWT token is missing or invalid',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - User does not have admin privileges',
    }),
  );
};

export const DeleteMovieDocs = () => {
  return applyDecorators(
    ApiTags('Movies'),
    ApiOperation({
      summary: 'Delete movie',
      description: 'Deletes a movie by its ID.',
    }),
    ApiResponse({
      status: 200,
      description: 'Movie deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'A New Hope deleted successfully',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Movie not found',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Movie with ID xyz not found' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - JWT token is missing or invalid',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - User does not have admin privileges',
    }),
  );
};
