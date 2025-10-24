// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'P3 API',
      version: '0.0.1',
      description: 'Documentación en SWAGGER de la API del proyecto P3_31480709',
    },
  },
  apis: ['./routes/*.js'], // Aquí se escanean tus rutas para anotaciones
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
