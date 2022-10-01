const { request, response } = require("express");
const CountryService = require("../services/contry.service");

const countryService = new CountryService();

const getCountries = async (req, res) => {
  try {
    const countries = await countryService.getCountries();

    return res.status(200).json({
      status: "ok",
      msg: "Paises recibidos correctamente",
      payload: {
        countries,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      msg: "Error al listar los paises",
    });
  }
};

const getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await countryService.getCountryById(id);
    return res.status(200).json({
      status: "ok",
      msg: "País recibido correctamente",
      payload: {
        country,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      status: "error",
      msg: "No se encuentra un país con esa ID",
    });
  }
};

const createCoutry = async (req, res) => {
  try {
    const { iso, countryName } = req.body;
    const savedCountry = await countryService.createCountry(iso.toUpperCase(), countryName);
    return res.status(200).json({
      status: "ok",
      msg: "País creado correctamente",
      payload: {
        savedCountry,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      msg: "Error al crear país",
    });
  }
};

const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { iso, countryName } = req.body;
    const updatedCountry = await countryService.updateCountry(id, {
      iso,
      countryName,
    });
    return res.status(200).json({
      status: "ok",
      msg: "País actualizado correctamente",
      payload: {
        updatedCountry,
      },
    });
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      status: "error",
      msg: "Error al actualizar país",
    });
    console.log(err);
  }
};

const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await countryService.deleteCountry(id);
    return res.status(200).json({
      status: "ok",
      msg: "País eliminado correctamente",
      payload: {
        country,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      status: "error",
      msg: "No se encuentra un país con esa ID",
    });
  }
};

module.exports = { getCountries, getCountryById, createCoutry, updateCountry, deleteCountry };
