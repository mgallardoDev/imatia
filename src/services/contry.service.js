const { sanitizeFilter } = require("mongoose");
const { Country } = require("../models");

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
  async createCountry(iso, countryName) {
    const savedCountry = await new Country({
      iso,
      countryName,
    }).save();

    if (savedCountry) {
      return savedCountry;
    }
    throw new Error("No se ha podido crear el país");
  }

  async updateCountry(id, modifiedCountry) {
    const country = await Country.findById(id);
    country.iso = modifiedCountry.iso;
    country.countryName = modifiedCountry.countryName;

    const updatedCountry = country.save();

    if (updatedCountry) {
      return updatedCountry;
    }
    throw new Error("No se ha podido actualizar el produto");
  }

  async deleteCountry(id) {
    const deleted = await Country.findByIdAndRemove(id);
    if (deleted) {
      return deleted;
    }
    throw new Error();
  }
}

module.exports = CountryService;
