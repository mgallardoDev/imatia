const { Schema, model } = require("mongoose");

const MarketSchema = Schema({
  marketName: {
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
      type: [Schema.Types.ObjectId],
      ref: "Country",
      default: []
  },
});

MarketSchema.methods.toJSON = function () {
  const { __v, ...market } = this.toObject();
  return { market };
};

module.exports = model("Market", MarketSchema);
