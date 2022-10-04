const { Market } = require("../models");
const country = require("../models/country");

class MarketService {
  constructor() {}

  async getMarkets(filters) {
    const markets = await Market.find();
    if (markets) {
      return markets;
    }
    throw new Error("Error cargndo la lista de mercados");
  }

  async getMarketById(id) {
    const market = Market.findById(id);
    if (market) {
      return market;
    }
    throw new Error("Mercado no encontrado");
  }

  async createMarket(code, marketName, countries) {
    const savedMarket = new Market({
      code,
      marketName,
      countries,
    }).save();
    if (savedMarket) {
      return savedMarket;
    }
    throw new Error("No se ha podido crear el mercado");
  }

  async deleteMarket(id) {
    const deleted = await Market.findByIdAndRemove(id);
    if(deleted){
      return deleted
    }
    throw new Error("Error al eleminar el mercado");
  }
}

module.exports = MarketService;
