import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: { title: 'Entrega – API Users', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: ['./src/routes/users.router.js'] // <- apunta a este archivo
};

export const swaggerSpecs = swaggerJSDoc(options);
