const router = require('express').Router();
const { updateAvatarValidation, updateUserValidation, userIdValidation } = require('../middlewares/validation');

const {
  getUsers,
  getUserById,
  updateUserInformation,
  getMyId,
  userAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMyId);
router.get('/:userId', userIdValidation, getUserById);
router.patch('/me', updateUserValidation, updateUserInformation);
router.patch('/me/avatar', updateAvatarValidation, userAvatar);

module.exports = router;
