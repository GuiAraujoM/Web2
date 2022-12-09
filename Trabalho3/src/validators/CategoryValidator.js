const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  owner: Joi.string().pattern(new RegExp("^[0-9]$")),
});

const validateCategoryDto = (category) => {
  const result = schema.validate(category, {
    abortEarly: false,
  });
  if (result.error) {
    return result.error;
  }
};

module.exports = validateCategoryDto;
