class Sale {
  date;
  ref;
  iso;
  transCode;
  units;

  constructor(data) {
    this.date = new Date(data.date);
    this.ref = data.ref;
    this.country = data.iso;
    this.transCode = data.transCode;
    this.units = data.units;
  }
}


module.exports =  Sale ;
