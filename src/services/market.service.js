const { Market } = require("../models");
const country = require("../models/country");
const market = require("../models/market");

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

  async createMarket(newMarket) {
    const savedMarket = new Market(newMarket).save();
    if (savedMarket) {
      return savedMarket;
    }
    throw new Error("No se ha podido crear el mercado");
  }

  async updateMarket(id, updatedMarket) {
    const marketToUpdate = await Market.findById(id);

    Object.assign(marketToUpdate, updatedMarket);

    const savedMarket = marketToUpdate.save();
    if (savedMarket) {
      return savedMarket;
    }
    throw new Error("No se ha podido actualizar el mercado");
  }

  async deleteMarket(id) {
    const deleted = await Market.findByIdAndRemove(id);
    if (deleted) {
      return deleted;
    }
    throw new Error("Error al eleminar el mercado");
  }
}

module.exports = MarketService;
