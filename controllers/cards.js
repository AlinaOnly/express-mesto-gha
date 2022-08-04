const Card = require('../models/card');
const { err400, err404, err500 } = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(err).send({ message: err500 }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(err).send({ message: err400 });
      }
      return res.status(err).send({ message: err500 });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(err404).send({ message: `Карточка ${req.user._id} ${err404}` });
      }
      if (err.name === 'CastError') {
        return res.status(err).send({ message: err400 });
      }
      return res.status(err).send({ message: err500 });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(err404).send({ message: `Карточка ${req.user._id} ${err404}` });
      }
      if (err.name === 'CastError') {
        return res.status(err).send({ message: err400 });
      }
      return res.status(err).send({ message: err500 });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(err404).send({ message: `Карточка ${req.user._id} ${err404}` });
      }
      if (err.name === 'CastError') {
        return res.status(err).send({ message: err400 });
      }
      return res.status(err).send({ message: err500 });
    });
};
