const router = require('express').Router();
const categoryController = require('../../controller/Dashborad/categoryController');
const { admin_middleware } = require('../../middleware/authMiddleware');

const { upload } = require('../../utiles/storageConfig');


// category router
router.post('/add-category', admin_middleware, upload.single('categoryImage'), categoryController.add_category);

router.get('/get-category', admin_middleware, categoryController.category_get);



module.exports = router;