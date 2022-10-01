const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
        openapi: "3.0.0",
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Token ausente o erróneo'
                }
            }
        },

    info: {
      title: "PruebaImatiaNodeJS",
      description: "Documentación del REST API de la prueba",
      version: "1.0.0",
    },
  },
  apis: [`${path.join(__dirname, "../routes/*.js")}`],
};

const swaggerDocs = (app, port) => {
    app.use(
      "/api/docs",
      swaggerUI.serve,
      swaggerUI.setup(swaggerJsDoc(swaggerOptions))
    );
}

module.exports = { swaggerOptions, swaggerDocs };
