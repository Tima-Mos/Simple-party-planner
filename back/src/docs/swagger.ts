import swaggerJsdoc from 'swagger-jsdoc'
import { Options } from 'swagger-jsdoc'

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Guild Planner API',
      version: '1.0.0',
      description: 'REST API для календаря встреч в фэнтези-фолк стилистике',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
    ],
    components: {
      schemas: {
        NicknameBody: {
          type: 'object',
          required: ['nickname'],
          properties: {
            nickname: {
              type: 'string',
              minLength: 2,
              maxLength: 20,
              pattern: '^[a-zA-Zа-яА-ЯёЁ0-9 _-]{2,20}$',
              example: 'Арагорн',
            },
          },
        },
        AvailabilityBody: {
          type: 'object',
          required: ['nickname', 'date'],
          properties: {
            nickname: {
              type: 'string',
              minLength: 2,
              maxLength: 20,
              example: 'Арагорн',
            },
            date: {
              type: 'string',
              pattern: '^\\d{4}-\\d{2}-\\d{2}$',
              example: '2026-07-20',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/docs/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
