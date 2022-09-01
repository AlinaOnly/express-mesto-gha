const { celebrate, Joi } = require('celebrate');

const regEx = /^https?:\/\/(www\.)?.[\w\-.+[\]()_~:/%?#@!$&'*,;=]*$/;

module.exports.createUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regEx),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regEx),
  }),
});

module.exports.createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(regEx).required(),
  }),
});

module.exports.cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),
});

module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string()
      .length(24)
      .hex()
      .required(),
  }),
});
