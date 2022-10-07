const MockDBController = require("../helpers/mockDB.controller");
const { Market, Country } = require("../models");

class SaleService {
  constructor() {
    this.mockDBcontroller = new MockDBController();
  }

  async getCountrySalesByDate(saleFilterDto) {
    const sales = this.mockDBcontroller.sales;
    let saleTime;
    const salesByDate = sales.filter((sale) => {
      saleTime = new Date(sale.date);
      return (
        saleTime >= saleFilterDto.initDate && saleTime <= saleFilterDto.endDate
      );
    });

    let countriesFiltered = await this.filterCountries(saleFilterDto);

    const salesBydateAndCountry = salesByDate.filter((sale) =>
      countriesFiltered.includes(sale.iso)
    );

    let salesObjectArray = await this.createEmptySaleObject(countriesFiltered);

    salesObjectArray = this.handleSalesObjectAndSalesData(
      salesObjectArray,
      salesBydateAndCountry
    );

    return salesObjectArray;
  }

  async filterCountries(saleFilterDto) {
    let countriesFiltered = [];
    if (saleFilterDto.market) {
      const markets = await Market.find({
        code: saleFilterDto.market,
      });
      countriesFiltered = markets.reduce((acc, market) => {
        for (let country of market.countries) {
          if (!acc.includes(country)) {
            acc.push(country);
          }
        }
        return acc;
      }, []);
    }

    if (saleFilterDto.iso && saleFilterDto.market) {
      countriesFiltered = countriesFiltered.filter((country) =>
        saleFilterDto.iso.includes(country)
      );
    } else if (saleFilterDto.iso) {
      Array.isArray(saleFilterDto.iso)
        ? (countriesFiltered = saleFilterDto.iso)
        : countriesFiltered.push(saleFilterDto.iso);
    }
    return countriesFiltered;
  }

  async createEmptySaleObject(countriesFiltered) {
    let salesObjectArray = [];

    for (const country of countriesFiltered) {
      const countryName = (await Country.findOne({ iso: country })).name;
      salesObjectArray.push({
        soldUnits: 0,
        returnedUnits: 0,
        iso: country,
        countryName,
      });
    }
    return salesObjectArray;
  }

  handleSalesObjectAndSalesData(salesObjectArray, salesBydateAndCountry) {
    salesObjectArray = salesBydateAndCountry.reduce((acc, sale) => {
      const countryIndex = salesObjectArray.findIndex(
        (saleInArray) => saleInArray.iso === sale.iso
      );
      const countryObject = {
        soldUnits:
          acc[countryIndex].soldUnits + (sale.transCode === 0 ? sale.units : 0),
        returnedUnits:
          acc[countryIndex].returnedUnits +
          (sale.transCode === 1 ? sale.units : 0),
        iso: acc[countryIndex].iso,
        countryName: acc[countryIndex].countryName,
      };
      countryIndex !== -1 ? acc.splice(countryIndex, 1) : null;
      acc.push(countryObject);
      return acc;
    }, salesObjectArray);
    return salesObjectArray;
  }
}

module.exports = SaleService;
