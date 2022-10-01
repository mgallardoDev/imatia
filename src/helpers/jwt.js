const jwt = require("jsonwebtoken");

const createJWT = (username, role) => {
  return new Promise((resolve, reject) => {
    const payload = { username, role };
console.log(payload)
    jwt.sign(payload, process.env.SECRETORPRIVATEKEY, (err, token) => {
      if (err) {
        reject("No se pudo generar el token");
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = { createJWT };
