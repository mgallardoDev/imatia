const validateFieldValue = (field, model) => {
  return async (req, res, next) => {
    const value = req.body[field];
    const checked = await model.findOne({ [field]: value.toUpperCase() });
    if (checked) {
      return res.status(400).json({
        status: "error",
        msg: `El ${field} ${value} ya existe en la base de datos`,
      });
    }
    next();
  };
};

module.exports = { validateFieldValue };
