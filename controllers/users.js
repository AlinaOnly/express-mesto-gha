require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => next(new NotFoundError('Пользователь с таким id не найден')))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'CastError') {
        next(new BadRequestError('Неверный id пользователя'));
      }
      return next(err);
    });
};

module.exports.getMyId = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь с таким id не найден')))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'CastError') {
        next(new BadRequestError('Неверный id пользователя'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then(({ _id }) => res.send({
          name,
          about,
          avatar,
          email,
          _id,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError('Такой пользователь уже существует'));
          }
          if (err.message === 'ValidationError') {
            return next(new BadRequestError('Некорректные данные'));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.updateUserInformation = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(() => next(new NotFoundError('Пользователь с таким id не найден')))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные о пользователе'));
      }
      return next(err);
    });
};

module.exports.userAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для обновления аватара'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      }).send({ token });
    }).catch(() => next(new UnauthorizedError('Ошибка авторизации')));
};
