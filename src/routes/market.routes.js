const { Router } = require("express");
const { getMarkets } = require("../controllers/market.controller");
const { validateJWT } = require("../middlewares");

const router = Router();

router.get("/",[validateJWT], getMarkets)

module.exports = router