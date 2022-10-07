const { Schema, model } = require("mongoose");

const CountrySchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre del país es obligatorio"],
    unique: true,
  },
  iso: {
    type: String,
    required: [true, "El código ISO del país es obligatorio"],
    unique: true,
  },
});

CountrySchema.methods.toJSON = function () {
  const { __v, ...country } = this.toObject();
  return { country };
};

module.exports = model("Country", CountrySchema);
