class MarketDto {
  code;
    name;
    countries;

    constructor(data) {
        this.code = data.code ? data.code.toUpperCase() : undefined;
        this.name = data.name;
        this.countries = data.countries
            ? data.countries.map((iso) => iso.toUpperCase(), [])
            : undefined;
        
    }


}

module.exports = MarketDto