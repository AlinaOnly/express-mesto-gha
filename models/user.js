const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длинна 2 символа'],
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длинна 2 символа'],
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    ref: 'avatar',
    required: true,
  },
}, {
  collection: 'users',
  versionKey: false,
});

module.exports.User = mongoose.model('user', userSchema);
