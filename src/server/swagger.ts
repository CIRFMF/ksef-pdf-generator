import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KSeF-FE Invoice Converter API',
      version: '1.0.0',
      description: 'API to generate PDF visualizations of invoices and UPO from XML files',
    },
  },
  apis: ['./src/server/index.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
