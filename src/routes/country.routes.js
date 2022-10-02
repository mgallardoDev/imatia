const { Router } = require("express");
const { check } = require("express-validator");
const {
  validate,
  validateJWT,
  validateRole,
  validateFieldValue,
  redisCache,
} = require("../middlewares");
const {
  getCountries,
  getCountryById,
  createCoutry,
  updateCountry,
  deleteCountry,
} = require("../controllers/country.controller");
const { Country } = require("../models");

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Country:
 *      type: object
 *      properties:
 *          countryName:
 *              type: string
 *              description: name of the country
 *          iso:
 *              type: string
 *              description: ISO 3166-1 alfa-2 code od the country
 *      required:
 *          - iso
 *          - countryName

 */

/**
 * @swagger
 *  /api/country:
 *    get:
 *      summary: listado de todos los paises
 *      security:
 *        - bearerAuth: []
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
 *                      countries:
 *                        type: array
 *                        items: 
 *                          type: object
 *                          properties:
 *                            country:
 *                              type: object
 *                              properties:
 *                               iso: 
 *                                type: string
 *                               countryname: 
 *                                type: string
 *                               _id:
 *                                type: string
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", [validateJWT, redisCache('countryList')], getCountries);

/**
 * @swagger
 *  /api/country/{id}:
 *    get:
 *      summary: buscar un país, por el id de mongo
 *      parameters:
 *       - in: path
 *         name: id   # Note the name is the same as in the path
 *         required: true
 *         schema:
 *           type: string
 *         example: 6338a90d421e104597f9e708
 *         description: id de mongo del país a buscar
 *      security:
 *        - bearerAuth: []
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
 *                      country:
 *                        type: object
 *                        properties:
 *                          country:
 *                            type: object
 *                            properties:
 *                             iso: 
 *                              type: string
 *                             countryname: 
 *                              type: string
 *                             _id:
 *                              type: string
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/:id",
  [
    validateJWT,
    check("id", "No es un identificador válido").isMongoId(),
    validate,
  ],
  getCountryById
);

/**
 * @swagger
 *  /api/country/:
 *    post:
 *      summary: creación de un país (Solo admin)
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Country'
 *            example:
 *              iso: VE
 *              countryName: Venezuela
 *      security:
 *        - bearerAuth: []
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
 *                      savedCountry:
 *                        type: object
 *                        properties:
 *                          country:
 *                            type: object
 *                            properties:
 *                             iso: 
 *                              type: string
 *                             countryname: 
 *                              type: string
 *                             _id:
 *                              type: string
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 *
 */
router.post(
  "/",
  [
    validateJWT,
    validateRole(["admin"]),
    check("iso", "El código ISO 3166-1 alfa-2 del paí ses obligatorio")
      .not()
      .isEmpty(),
    check(
      "iso",
      "El código ISO 3166-1 alfa-2 del país tiene que estar compuesto por dos caracteres alfabéticos."
    ).isLength({ min: 2, max: 2 }),
    check("countryName", "El nombre es obligatorio").not().isEmpty(),
    validateFieldValue("countryName", Country),
    validateFieldValue("iso", Country),
    validate,
  ],
  createCoutry
);

/**
 * @swagger
 *  /api/country/{id}:
 *    put:
 *      summary: edición de un país (Solo admin)
 *      parameters:
 *       - in: path
 *         name: id   # Note the name is the same as in the path
 *         required: true
 *         schema:
 *           type: string
 *         example: 6338302aa8d639a000df7741
 *         description: id de mongo del país a buscar
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Country'
 *            example:
 *              iso: VE
 *              countryName: VVenezuela
 *      security:
 *        - bearerAuth: []
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
 *                      country:
 *                        type: object
 *                        properties:
 *                          updatedCountry:
 *                            type: object
 *                            properties:
 *                             iso: 
 *                              type: string
 *                             countryname: 
 *                              type: string
 *                             _id:
 *                              type: string
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 *
 */
router.put(
  "/:id",
  [
    validateJWT,
    validateRole(["admin"]),
    check("id", "No es un identificador válido").isMongoId(),
    check("countryName", "El nombre es obligatorio").not().isEmpty(),
    check("iso", "El código ISO 3166-1 alfa-2 del país es obligatorio")
      .not()
      .isEmpty(),
    check(
      "iso",
      "El código ISO 3166-1 alfa-2 del país tiene que estar compuesto por dos caracteres alfabéticos."
    ).isLength({ min: 2, max: 2 }),
    validate,
  ],
  updateCountry
);

/**
 * @swagger
 *  /api/country/{id}:
 *    delete:
 *      summary: borra un país (Solo admin)
 *      parameters:
 *       - in: path
 *         name: id   # Note the name is the same as in the path
 *         required: true
 *         schema:
 *           type: string
 *         example: 6338b8c54cea6266ecddd34f
 *         description: id de mongo del país a buscar
 *      security:
 *        - bearerAuth: []
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
 *                      country:
 *                        type: object
 *                        properties:
 *                          country:
 *                            type: object
 *                            properties:
 *                             iso: 
 *                              type: string
 *                             countryname: 
 *                              type: string
 *                             _id:
 *                              type: string
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 *
 */
router.delete(
  "/:id",
  [
    validateJWT,
    validateRole(["admin"]),
    check("id", "No es un identificador válido").isMongoId(),
    validate,
  ],
  deleteCountry
);
module.exports = router;
