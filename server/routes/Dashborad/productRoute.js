const router = require('express').Router();
const productController = require('../../controller/Dashborad/productController');
const { admin_middleware } = require('../../middleware/authMiddleware');
const { upload } = require('../../utiles/storageConfig');


router.post('/add-product', admin_middleware, upload.single('productImage'), productController.add_product);

router.get('/get-products', admin_middleware, productController.get_products);


module.exports = router;