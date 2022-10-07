const fs = require("fs");

 class MockDBController {
   constructor() {
     this.usersPath = "./src/data/user.json";
     this.salesPath = "./src/data/sales.json";
   }

   get users() {
     if (!fs.existsSync(this.usersPath)) {
       return null;
     }
     return JSON.parse(fs.readFileSync(this.usersPath, { encoding: "utf-8" }));
   }

   get sales() {
     if (!fs.existsSync(this.salesPath)) {
       return null;
     }
     return JSON.parse(fs.readFileSync(this.salesPath, { encoding: "utf-8" }));
   }
 }

module.exports = MockDBController;
