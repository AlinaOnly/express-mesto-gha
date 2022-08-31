require('dotenv').config();
const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { createUserValidation, loginValidation } = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);

router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.use('/*', auth, () => {
  throw new NotFoundError('Нет такой страницы');
});

module.exports = router;
