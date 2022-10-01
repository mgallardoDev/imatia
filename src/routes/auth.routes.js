const { Router } = require("express");
const { check } = require("express-validator");
const { validate } = require("../middlewares");
const { login } = require("../controllers/auth.controller");

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Login:
 *      type: object
 *      properties:
 *        userName:
 *          type: string
 *        password:
 *          type: string
 *      required:
 *        - userName
 *        - password
 *      example:
 *        username: basicUser
 *        password: basicUser
 *        
 */

/**
 * @swagger
 *  /api/auth/login:
 *    post:
 *      summary: log-in de usuario (para pruebas usar (basicUser,basicUser)  (adminUser,adminUser)) e introducir el token que obtenemos aqui en el dialogo autorizacion de swagger
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *            example:
 *              username: basicUser
 *              password: basicUser
 *      responses:
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                  msg:
 *                    type: string  
 *                  payload:
 *                    type: object
 *                    properties:
 *                      user:
 *                        type: object
 *                        properties:
 *                          username:
 *                            type: string
 *                          role: 
 *                            type: string
 *                      token:
 *                        type: string    
 */
router.post(
  "/login",
  [check("password", "El password es obligatorio").exists(), validate],
  login
);

module.exports = router;
