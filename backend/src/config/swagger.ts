import { Express } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'Blog website REST API documentation',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
}

export const setupSwagger = (app: Express) => {
  const specs = swaggerJsdoc(options)
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs))
  console.log('📚 Swagger docs available at /api/docs')
}
