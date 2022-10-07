require("dotenv").config();
const Server = require("./models/server");

const server = new Server();

if (require.main === module) {
  server.listen();
}

