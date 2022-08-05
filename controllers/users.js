const { User } = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Пользователя нет в базе' });
      }
      if (err.message === 'CastError') {
        return res.status(400).send({ message: 'Bad request' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Bad request' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};

module.exports.getUserMe = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Пользователя нет в базе' });
      }
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Bad request' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};

module.exports.userAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: 'Пользователя нет в базе' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Bad request' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};
