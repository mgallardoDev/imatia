const { Schema, model } = require("mongoose");

const MarketSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre del mercado es obligatorio"],
    unique: true,
  },
  code: {
    type: String,
    required: [true, "El código mercado es obligatorio"],
    unique: true,
  },
  countries: {
    //Descartado porq ue no me di cuenta que en el pdf especificaban que seria un array de isos.
    // type: [Schema.Types.ObjectId],
    // ref: "Country",
    // default: []

    type: [String],
    required: [true, "El código del país es obligatorio"],
    default: [],
  },
});

MarketSchema.methods.toJSON = function () {
  const { __v, ...market } = this.toObject();
  return { market };
};

module.exports = model("Market", MarketSchema);
