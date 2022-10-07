const { sanitizeFilter } = require("mongoose");
const { Country, Market } = require("../models");
const { find } = require("../models/country");

class CountryService {
  constructor() {}

  async getCountries() {
    const countries = await Country.find();
    if (countries) {
      return countries;
    }
    throw new Error("No se ha podido obtener la lista de paises");
  }

  async getCountryById(id) {
    const country = await Country.findById(id);
    if (country) {
      return country;
    }
    throw new Error("País no encontrado");
  }

  async getFilteredCountry(filter) {
    const country = await Country.findOne(filter);
    if (country) {
      return country;
    }
    throw new Error("País no encontrado");
  }
  async createCountry(countryDto) {
    const savedCountry = await new Country(countryDto).save();

    if (savedCountry) {
      return savedCountry;
    }
    throw new Error("No se ha podido crear el país");
  }

  async updateCountry(id, modifiedCountry) {
    const country = await Country.findById(id);
    modifiedCountry.iso ? (country.iso = modifiedCountry.iso) : null;
    modifiedCountry.name ? (country.name = modifiedCountry.name) : null;

    const updatedCountry = country.save();

    if (updatedCountry) {
      return updatedCountry;
    }
    throw new Error("No se ha podido actualizar el produto");
  }

  async deleteCountry(id) {
    const deleted = await Country.findByIdAndRemove(id);
    if (deleted) {
      this.deleteCountryInMarkets(deleted.iso);
      return deleted;
    }
    throw new Error("Error al eleminar el país");
  }

  async deleteCountryInMarkets(iso) {
    const markets = await Market.find({ countries: iso });
    markets.forEach((market) => {
      market.countries.splice(market.countries.indexOf(iso), 1);
      const savedMarket = market.save();
      if (savedMarket) {
        return savedMarket;
      }
      throw new Error("No se ha podido actualizar el mercado");
    });
  }
}

module.exports = CountryService;
