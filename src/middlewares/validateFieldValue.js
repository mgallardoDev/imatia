// El parámetro de entrada tieneque ser un json con el siguiente formato
// {
//  field: campo que vamos a evaluar (string),
//  model: Modelo de mongo sobre elq ue realizaremos la comprobacion
//  mustExist: true en caso de que sea obligatorio que exista, false en caso de que sea obligatorio que no exista
// }
const validateFieldValue = (data) => {
  const { field, model, mustExist } = data;
  return async (req, res, next) => {
    const value = req.body[field];
    const checked = await model.findOne({ [field]: value.toUpperCase() });
    if (checked && !mustExist) {
      return res.status(400).json({
        status: "error",
        msg: `El ${field} ${value} ya existe en la base de datos en la colección ${model.prototype.collection.name}`,
      });
    }
    if (!checked && mustExist) {
      return res.status(400).json({
        status: "error",
        msg: `El ${field} ${value} no existe en la base de datos en la colección ${model.prototype.collection.name}`,
      });
    }
    next();
  };
};

// El parámetro de entrada tieneque ser un json con el siguiente formato
// {
//  arrayField: campo array que vamos a evaluar sus valores ,
//  modelField: campo donde comprobaremos los valores dentro del modelo
//  model: Modelo de mongo sobre elq ue realizaremos la comprobacion
//  mustExist: true en caso de que sea obligatorio que exista, false en caso de que sea obligatorio que no exista
// }
const validateArrayFieldValues = (data) => {
  const { arrayField, modelField, model, mustExist } = data;
  return async (req, res, next) => {
    const arrField = req.body[arrayField];

    for (const value of arrField) {
      const checked = await model.findOne({
        [modelField]: value.toUpperCase(),
      });
      if (checked && !mustExist) {
        return res.status(400).json({
          status: "error",
          msg: `El ${modelField} ${value} ya existe en la base de datos en la colección ${model.prototype.collection.name}`,
        });
      } else if (!checked && mustExist) {
        return res.status(400).json({
          status: "error",
          msg: `El ${modelField} ${value} no existe en la base de datos en la colección ${model.prototype.collection.name}`,
        });
      }
    }
    next();
  };
};
module.exports = { validateFieldValue, validateArrayFieldValues };
