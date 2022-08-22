const { Router } = require('express');
const { auth } = require('../middleware/auth');
const userController = require('../controllers/userControllers');
const router = Router();

router.post('/signup',userController.signup);
router.post('/login', userController.login);
router.post('/user/logout', auth, userController.logout_post);
router.post('/user/logoutall',  auth, userController.logoutall_post);
router.patch('/user/edit/:id', auth, userController.edit_user);
router.patch('/password/:id', auth, userController.password_patch);
router.get('/user/profile/:id', auth, userController.get_profile);


module.exports = router;