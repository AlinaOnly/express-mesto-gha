require('dotenv').config();
const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { createUserValidation, loginValidation } = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-err');

router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('/*', () => {
  throw new NotFoundError('Нет такой страницы');
});

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);

module.exports = router;
