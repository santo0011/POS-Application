const router = require('express').Router();
const authController = require('../controller/authController');


router.post('/user-register', authController.register)

router.post('/verify-email', authController.verify_email)

router.post('/user-login', authController.user_login);


module.exports = router;