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
  getCountryByIso,
} = require("../controllers/country.controller");
const { Country } = require("../models");
const { redisCacheWithIdParam } = require("../middlewares/cache");

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Country:
 *      type: object
 *      properties:
 *          name:
 *              type: string
 *          iso:
 *              type: string
 *              description: código ISO 3166-1 alfa-2 del país
 *      required:
 *          - iso
 *          - name
 */

/**
 * @swagger
 *  /api/country:
 *    get:
 *      tags: [
 *        country
 *      ]
 *      summary: listado de todos los paises (REDIS CACHE)
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
 *                          $ref: '#/components/schemas/Country'
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", [validateJWT, redisCache("countryList")], getCountries);

/**
 * @swagger
 *  /api/country/{id}:
 *    get:
 *      tags: [
 *        country
 *      ]
 *      summary: buscar un país, por el id de mongo (REDIS CACHE)
 *      parameters:
 *       - in: path
 *         name: id
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
 *                    $ref: '#/components/schemas/Country'
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/:id",
  [
    validateJWT,
    check("id", "No es un identificador válido").isMongoId(),
    validate,
    redisCacheWithIdParam("country"),
  ],
  getCountryById
);

/**
 * @swagger
 *  /api/country/iso/{iso}:
 *    get:
 *      tags: [
 *        country
 *      ]
 *      summary: buscar un país, por el código  ISO 3166-1 alfa-2
 *      parameters:
 *       - in: path
 *         name: iso
 *         required: true
 *         schema:
 *           type: string
 *         example: ES
 *         description: Código ISO 3166-1 alfa-2 del pais a buscar
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
 *                    $ref: '#/components/schemas/Country'
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/iso/:iso",
  [
    validateJWT,
    check(
      "iso",
      "El código ISO 3166-1 alfa-2 del país tiene que estar compuesto por dos caracteres alfabéticos."
    ).isLength({ min: 2, max: 2 }),
    validate,
  ],
  getCountryByIso
);

/**
 * @swagger
 *  /api/country/:
 *    post:
 *      tags: [
 *        country
 *      ]
 *      summary: creación de un país (Solo admin)
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Country'
 *            example:
 *              iso: VE
 *              name: Venezuela
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
 *                            $ref: '#/components/schemas/Country'
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
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validate,
    validateFieldValue({
      field: "name",
      model: Country,
      mustExist: false,
    }),
    validateFieldValue({ field: "iso", model: Country, mustExist: false }),
  ],
  createCoutry
);

/**
 * @swagger
 *  /api/country/{id}:
 *    put:
 *      tags: [
 *        country
 *      ]
 *      summary: edición de un país (Solo admin)
 *      parameters:
 *       - in: path
 *         name: id
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
 *              name: VVenezuela
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
 *                         $ref: '#/components/schemas/Country'
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
    check(
      "iso",
      "El código ISO 3166-1 alfa-2 del país tiene que estar compuesto por dos caracteres alfabéticos."
    )
      .if(check("iso").exists())
      .isString()
      .isLength({ min: 2, max: 2 }),
    validate,
  ],
  updateCountry
);

/**
 * @swagger
 *  /api/country/{id}:
 *    delete:
 *      tags: [
 *        country
 *      ]
 *      summary: borra un país. Al eliminarlo es eliminado tb de todos los mercados en los que se encuentra (Solo admin)
 *      parameters:
 *       - in: path
 *         name: id
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
 *                         $ref: '#/components/schemas/Country'
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
