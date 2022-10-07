const MarketDto = require("../dtos/market.dto");
const { redisClient } = require("../helpers/redis.controller");
const { MarketService } = require("../services");

const marketService = new MarketService();

const getMarkets = async (req, res) => {
  try {
    const markets = await marketService.getMarkets();
    redisClient.setEx("marketList", 5, JSON.stringify(markets));
    return res.status(200).json({
      status: "ok",
      msg: "Mercados recibidos correctamente",
      payload: {
        markets,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      msg: error,
    });
  }
};

const getMarketById = async (req, res) => {
  try {
    const { id } = req.params;
    const market = await marketService.getMarketById(id);
    redisClient.setEx("market" + id, 5, JSON.stringify(market));
    return res.status(200).json({
      status: "ok",
      msg: "Mercados recibidos correctamente",
      payload: {
        code: market.code,
        name: market.name,
        countries: market.countries,
        _id: market._id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      msg: error,
    });
  }
};

const createMarket = async (req, res) => {
  try {
    const body= req.body;
    const savedMarket = await marketService.createMarket(new MarketDto(body));
    return res.status(200).json({
      status: "ok",
      msg: "Mercado creado correctamente",
      payload: {
        savedMarket,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      msg: error,
    });
  }
};

const updateMarket = async (req, res) => {
  try {
    const { id } = req.params;
    const body= req.body;
    const updatedMarket = await marketService.updateMarket(id, new MarketDto(body));
    return res.status(200).json({
      status: "ok",
      msg: "Mercado actualizado correctamente",
      payload: {
        updatedMarket,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      msg: error,
    });
  }
};

const deleteMarket = async (req, res) => {
  try {
    const { id } = req.params;
    const market = await marketService.deleteMarket(id);
    return res.status(200).json({
      status: "ok",
      msg: "Mercado eliminado correctamente",
      payload: {
        code: market.code,
        name: market.name,
        countries: market.countries,
        _id: market._id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      msg: error,
    });
  }
};
module.exports = {
  getMarkets,
  getMarketById,
  createMarket,
  deleteMarket,
  updateMarket,
};
