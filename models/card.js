const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длинна 2 символа'],
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    ref: 'link',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
