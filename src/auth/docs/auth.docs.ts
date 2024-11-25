import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';

export const RegisterDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Register new user',
      description: 'Creates a new user account in the system.',
    }),
    ApiBody({
      description: 'User registration data',
      schema: {
        type: 'object',
        required: ['full_name', 'email', 'password'],
        properties: {
          full_name: {
            type: 'string',
            example: 'John Doe',
            description: 'The full name of the user',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'A valid email address',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123',
            description: 'Password (6-20 characters)',
            minLength: 6,
            maxLength: 20,
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'User successfully registered',
      schema: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          full_name: {
            type: 'string',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            example: 'john.doe@example.com',
          },
          role: {
            type: 'string',
            example: 'regular',
            enum: ['regular', 'admin'],
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
    ApiBadRequestResponse({
      description: 'Invalid input data',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 400,
          },
          message: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: [
              'email must be a valid email',
              'password must be longer than 6 characters',
            ],
          },
          error: {
            type: 'string',
            example: 'Bad Request',
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Email already exists',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 409,
          },
          message: {
            type: 'string',
            example: 'Email already exists',
          },
          error: {
            type: 'string',
            example: 'Conflict',
          },
        },
      },
    }),
  );
};

export const LoginDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description: 'Authenticates a user and returns a JWT token.',
    }),
    ApiBody({
      description: 'User login credentials',
      schema: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'The registered email address',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123',
            description: 'The user password',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully logged in',
      schema: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
              },
              full_name: {
                type: 'string',
                example: 'John Doe',
              },
              email: {
                type: 'string',
                example: 'john.doe@example.com',
              },
              role: {
                type: 'string',
                example: 'regular',
                enum: ['regular', 'admin'],
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
              token: {
                type: 'string',
                format: 'jwt',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
            },
          },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT token for authentication',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 401,
          },
          message: {
            type: 'string',
            example: 'Invalid password',
          },
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'User not found',
          },
          error: {
            type: 'string',
            example: 'Not Found',
          },
        },
      },
    }),
  );
};
