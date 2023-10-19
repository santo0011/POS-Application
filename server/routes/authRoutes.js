const router = require('express').Router();
const authController = require('../controller/authController');
const { admin_middleware } = require('../middleware/authMiddleware');
const { upload } = require('../utiles/storageConfig');


router.post('/user-register', authController.register)

router.post('/verify-email', authController.verify_email)

router.post('/user-login', authController.user_login);


// profie router
router.post('/add-customer-profile', admin_middleware, upload.single('profileImage'), authController.add_customer_profile);

router.get('/get-customer-profile', admin_middleware, authController.get_customer_profile);

router.put('/update-customer-profile', admin_middleware, upload.single('profileImage'), authController.update_customer_profile);



module.exports = router;