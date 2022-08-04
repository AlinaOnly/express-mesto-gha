const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  getUserMe,
  userAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', getUserMe);
router.patch('/me/avatar', userAvatar);

module.exports = router;
