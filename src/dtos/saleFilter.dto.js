class SaleFilterDto {
  initDate;
  endDate;
  iso;
  market;

  constructor(data) {
    this.initDate = new Date(data.init);
    this.endDate = new Date(data.end);
    if (data.iso && Array.isArray(data.iso)) {
      this.iso = data.iso.map((iso) => iso.toUpperCase());
    } else this.iso = data.iso ? data.iso.toUpperCase() : null;
    if (data.market && Array.isArray(data.market)) {
      this.market = data.market.map(market => market.toUpperCase())
    }else
      this.market = data.market ? data.market.toUpperCase() : null;
  }
}
module.exports = SaleFilterDto;
