const router = require('express').Router();
const productController = require('../../controller/Dashborad/productController');
const { admin_middleware } = require('../../middleware/authMiddleware');
const { upload } = require('../../utiles/storageConfig');


router.post('/add-product', admin_middleware, upload.single('productImage'), productController.add_product);

router.get('/get-products', admin_middleware, productController.get_products);

router.delete('/delete-product/:pId', admin_middleware, productController.delete_product);

router.get('/edit-product/:pId', admin_middleware, productController.edit_product);

router.put('/update-product', admin_middleware,upload.single('productImage'), productController.update_product);



module.exports = router;