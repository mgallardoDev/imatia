const { Router } = require("express");
const { check } = require("express-validator");
const {
  getMarkets,
  getMarketById,
  createMarket,
  deleteMarket,
  updateMarket,
} = require("../controllers/market.controller");
const {
  validateJWT,
  validateRole,
  validate,
  redisCache,
} = require("../middlewares");
const { redisCacheWithIdParam } = require("../middlewares/cache");
const {
  validateArrayFieldValues,
  validateFieldValue,
} = require("../middlewares/validateFieldValue");
const { Market, Country } = require("../models");

const router = Router();

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *    Market:
 *      type: object
 *      properties:
 *          marketName:
 *              type: string
 *          code:
 *              type: string
 *              description: Código de mercado, de entre 2 y 5 caracteres
 *          countries:
 *               type: array
 *               items:
 *                  type: string
 *               description: Arry con isos de los paises que forman el mercado. Estos deben exisstir en la coleccion countries.
 *      required:
 *          - code
 *          - marketName
 *          - countries
 */

/**
 * @swagger
 *  /api/market:
 *    get:
 *      tags: [
 *        market
 *      ]
 *      summary: listado de todos los mercados (REDIS CACHE)
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
 *                      markets:
 *                        type: array
 *                        items:
 *                          $ref: '#/components/schemas/Market'
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", [validateJWT, redisCache("marketList")], getMarkets);

/**
 * @swagger
 *  /api/market/{id}:
 *    get:
 *      tags: [
 *        market
 *      ]
 *      summary: buscar un mercado, por el id de mongo (REDIS CACHE)
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 633b6fc70f12fbc46e9298ee
 *         description: id de mongo del mercado a buscar
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
 *                    $ref: '#/components/schemas/Market'
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/:id",
  [validateJWT, redisCacheWithIdParam("market")],
  getMarketById
);

/**
 * @swagger
 *  /api/market/:
 *    post:
 *      tags: [
 *        market
 *      ]
 *      summary: creación de un mercado (Solo admin)
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Market'
 *            example:
 *              code: UE
 *              marketName: Unión Europea
 *              countries: ['ES', 'PT', 'IT']
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
 *                      savedMarket:
 *                        type: object
 *                        properties:
 *                          market:
 *                            $ref: '#/components/schemas/Market'
 *        '401':
 *          $ref: '#/components/responses/UnauthorizedError'
 */

router.post(
  "/",
  [
    validateJWT,
    validateRole("admin"),
    check("code", "El código del mercado es obligatorio").not().isEmpty(),
    check("marketName", "El nombre del mercado es obligatorio").not().isEmpty(),
    check(
      "code",
      "El código de mercado debe tener una longitu de entre 2 y 5 caracteres"
    ).isLength({ min: 2, max: 5 }),
    check(
      "countries.*",
      "Todos los isos deben tener una longitud de 2 caracteres"
    ).isLength({ min: 2, max: 2 }),
    validate,
    validateFieldValue({ field: "code", model: Market, mustExist: false }),
    validateFieldValue({
      field: "marketName",
      model: Market,
      mustExist: false,
    }),
    validateArrayFieldValues({
      arrayField: "countries",
      modelField: "iso",
      model: Country,
      mustExist: true,
    }),
  ],
  createMarket
  );
  
  /**
 * @swagger
 *  /api/market/{id}:
 *    put:
 *      tags: [
 *        market
 *      ]
 *      summary: edición de un mercado (Solo admin)
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6338302aa8d639a000df7741
 *         description: id de mongo del mercado a buscar
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Market'
 *            example:
 *              code: TEST
 *              marketName: testMercado
 *              countries: [ES, CH]
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
 *                      market:
 *                         $ref: '#/components/schemas/Market'
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
      check("code", "El código del mercado es obligatorio").not().isEmpty(),
      check("marketName", "El nombre del mercado es obligatorio")
        .not()
        .isEmpty(),
      check(
        "code",
        "El código de mercado debe tener una longitu de entre 2 y 5 caracteres"
      ).isLength({ min: 2, max: 5 }),
      check(
        "countries.*",
        "Todos los isos deben tener una longitud de 2 caracteres"
      ).isLength({ min: 2, max: 2 }),
      validate,
    ],
    updateMarket
  );
  
/**
 * @swagger
 *  /api/market/{id}:
 *    delete:
 *      tags: [
 *        market
 *      ]
 *      summary: borra un mercado(Solo admin)
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 633b6fc70f12fbc46e9298ee
 *         description: id de mongo del mercado a buscar
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
 *                    $ref: '#/components/schemas/Market'
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
  deleteMarket
);


// TODO en getmarkets aplicar redis y preparar el helper que crea los filtro desde los queryparams
