const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string().email(),
});

const validateUserDto = (user) => {
  const result = schema.validate(user, {
    abortEarly: false,
  });
  if (result.error) {
    return result.error;
  }
};

module.exports = validateUserDto;
