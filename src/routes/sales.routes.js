const { Router } = require("express");
const { check, query } = require("express-validator");
const { getSales } = require("../controllers/sales.controller");
const { validateJWT, validate } = require("../middlewares");

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Sale:
 *      type: object
 *      properties:
 *          date:
 *              type: date
 *          ref:
 *              type: string
 *          country:
 *              type: string
 *          transCode:
 *              type: string
 *              description: 0 para venta, 1 para devolución
 *          units:
 *              type: integer
 *      required:
 *        - date
 *        - ref
 *        - country
 *        - transCode
 *        - units
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    SaleDetail:
 *      type: object
 *      properties:
 *          soldUnits:
 *              type: integer
 *          returnedUnits:
 *              type: integer
 *          countryName:
 *              type: string
 *          iso:
 *              type: string
 *              description: código ISO 3166-1 alfa-2 del país
 *          units:
 *              type: integer
 */

/**
 * @swagger
 *  /api/sale:
 *    get:
 *      tags: [
 *        sale
 *      ]
 *      summary: devuelve un array de objetos con un resumen de las ventas y devolulciones por pais. Es filtrable por pais (uno o varios paises) y por mercado (uno o varios mercados). los filtros son compatibles entre ellos.
 *      parameters:
 *        - in: query
 *          name: init
 *          required: true
 *          description: fecha de inicio en formato yyyy-mm-dd
 *        - in: query
 *          name: end
 *          required: true
 *          description: fecha fin en formato yyyy-mm-dd
 *        - in: query
 *          name: iso
 *          description: código ISO 3166-1 alfa-2 del país
 *          schema:
 *           type: array
 *           items:
 *            type: string
 *        - in: query
 *          name: market
 *          description: código del mercado
 *          schema:
 *           type: array
 *           items:
 *              type: string
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SaleDetail'
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/",
  [
    validateJWT,
    query("init", "falta la fecha de inicio o es incorrecta")
      .exists()
      .if(query("init").exists())
      .notEmpty(),
    query("end", "falta la fecha de fin o es incorrecta")
      .exists()
      .if(query("end").exists())
      .notEmpty(),
    validate,
  ],
  getSales
);

module.exports = router;
