const bcrypt = require("bcrypt");
const { response, json } = require("express");
const { createJWT } = require("../helpers/jwt");
const MockDBController = require("../helpers/mockDB.controller");

const login = async (req, res = response) => {
  const mockDBcontroller = new MockDBController();

  try {
    const users = mockDBcontroller.users;
    const user = users.find((user) => user.username === req.body.username);
    if (!user) {
      return res.status(400).json({
        status: "error",
        msg: "Usuario incorrecto",
      });
    }

    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        status: "error",
        msg: "password incorrecto",
      });
    }

      const token = await createJWT(user.username, user.role);
    
      delete user.password
      
    res.status(200).json({
      status: "ok",
      msg: "usuario logueado",
      payload: { user, token },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      msg: "Algo salio mal",
    });
  }
};

module.exports = { login };
