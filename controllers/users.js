const { User } = require('../models/user');
const { err400, err404, err500 } = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(err).send({ message: err500 }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(err404).send({ message: `Пользователь ${req.user._id} ${err404}` });
      }
      if (err.name === 'CastError') {
        return res.status(err).send({ message: err400 });
      }
      return res.status(err).send({ message: err500 });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(err).send({ message: err400 });
      }
      return res.status(err).send({ message: err500 });
    });
};

module.exports.getUserMe = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(err404).send({ message: `Пользователь ${req.user._id} ${err404}` });
      }
      if (err.name === 'ValidationError') {
        return res.status(err).send({ message: err400 });
      }
      return res.status(err).send({ message: err500 });
    });
};

module.exports.userAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(err404).send({ message: `Пользователь ${req.user._id} ${err404}` });
      }
      if (err.name === 'ValidationError') {
        return res.status(err).send({ message: err400 });
      }
      return res.status(err).send({ message: err500 });
    });
};
