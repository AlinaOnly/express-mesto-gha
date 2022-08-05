const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(() => res.status(500).send({ message: 'Internal Server Error' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'ValidationError') {
        return res.status(400).send({ message: 'Bad request' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Карточки нет в базе' });
      }
      if (err.message === 'CastError') {
        return res.status(400).send({ message: 'Bad request' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(404).send({ message: 'Карточки нет в базе' });
      }
      if (err.message === 'CastError') {
        return res.status(400).send({ message: 'Bad request' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Карточки нет в базе' });
      }
      if (err.message === 'CastError') {
        return res.status(400).send({ message: 'Bad request' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};
