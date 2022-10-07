const CountryDto = require("../dtos/country.dto");
const { Market } = require("../models");
const emitter = new require("events").EventEmitter();
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

  async createMarket(marketDto) {
    const savedMarket = new Market(marketDto).save();
    if (savedMarket) {
      return savedMarket;
    }
    throw new Error("No se ha podido crear el mercado");
  }

  async updateMarket(id, modifiedMarket) {
    const market = await Market.findById(id);
    modifiedMarket.code ? market.code = modifiedMarket.code : null;
    modifiedMarket.name ? market.name = modifiedMarket.name : null;
    modifiedMarket.countries ? market.countries = modifiedMarket.countries : null;
    const savedMarket = market.save();
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
