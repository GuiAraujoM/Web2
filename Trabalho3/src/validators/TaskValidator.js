const Joi = require("joi");

const schema = Joi.object({
  subject: Joi.string().min(3).max(30).required(),
  description: Joi.string().max(255),
  owner: Joi.string().pattern(new RegExp("^[0-9]$")).required(),
  category: Joi.string().pattern(new RegExp("^[0-9]$")),
  done: Joi.boolean().required(),
  due_date: Joi.date(),
  completed_at: Joi.date(),
  email: Joi.string().email(),
});

const validateTaskDto = (task) => {
  const result = schema.validate(task, {
    abortEarly: false,
  });
  if (result.error) {
    return result.error;
  }
};

module.exports = validateTaskDto;
