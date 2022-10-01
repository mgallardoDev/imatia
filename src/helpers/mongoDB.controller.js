const mongoose = require("mongoose");

const dbConection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    mongoose.set("returnOriginal", false);
    console.log("Base de datos OnLine");
  } catch (error) {
    console.error(error);
    throw new Error("Error iniciando la base de datos");
  }
};

module.exports = {
  dbConection,
};
