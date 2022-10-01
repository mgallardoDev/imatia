const path = require("path");
const express = require("express");


const { paths } = require("../config/paths");
const { AuthRoutes, CountryRoutes } = require("../routes");
const { dbConection } = require("../helpers/mongoDB.controller");
const { swaggerOptions, swaggerDocs } = require("../config/swagger");

class Server {
  constructor() {
    this.port = process.env.PORT;
    this.app = express();

    dbConection();
    this.middlewares();
    this.routes();

    swaggerDocs(this.app, this.port)
  }

  middlewares() {
    this.app.use(express.json());

  }

  routes() {
    this.app.get(paths.api, (req, res) => {
      res.status(200).json({
        status: "ok",
        msg: "Bienvenidos al APIRest de la prueba técnica de Imatia",
      });
    });

    this.app.use(paths.auth, AuthRoutes);
    this.app.use(paths.country, CountryRoutes);
    // this.app.use()
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor escuchando en el puerto ${this.port}`);
    });
  }
}

module.exports = Server;
