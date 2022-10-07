class CountryDto {
  iso;
  name;

  constructor(countryData) {
    this.iso = countryData.iso ? countryData.iso.toUpperCase() : null;
    this.name = countryData.name;
  }
}

module.exports = CountryDto;
