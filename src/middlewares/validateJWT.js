const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const validateJWT = async (req = request, res = response, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      msg: "No hay token en el request",
    });
  }
  try {
    
    token.startsWith("Bearer ") ? (token = token.substring(7)) : null;

    const { username, role } = jwt.verify(
      token,
      process.env.SECRETORPRIVATEKEY
    );
    console.log(username, role);
    if (!username) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existe",
      });
    }
    req.user = { username, role };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validateJWT,
};
