const fs = require("fs");

 class  MockDBController {
  constructor() {
    this.usersPath = "./src/data/user.json";
    this.sellsPath = "./src/data/sell.json";
  }

  get users() {
      if (!fs.existsSync(this.usersPath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(this.usersPath, { encoding: "utf-8" }));
   }
   
   
}

module.exports = MockDBController;
