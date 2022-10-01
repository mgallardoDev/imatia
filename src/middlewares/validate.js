const { validationResult } = require("express-validator");

const validate = (req, response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.status(400).json(errors);
  }

  next();
};

module.exports = {
  validate,
};
