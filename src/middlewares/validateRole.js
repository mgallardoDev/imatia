
const validateRole = (rolesArray) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(500).json({
        msg: "se quiere verificar el rol sin validar el token primero",
      });
    }

    const { role } = req.user;
    if (rolesArray.includes(role)) {
      console.log("Control de acceso: OK");
      next();
    } else {
      console.log("Control de acceso: NO AUTORIZADO");

      return res.status(401).json({
        msg: "El usuario no tiene permisos",
      });
    }
  };
};

module.exports = { validateRole };
