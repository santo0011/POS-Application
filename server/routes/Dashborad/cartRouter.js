const router = require('express').Router();
const cartController = require('../../controller/Dashborad/cartController');
const { admin_middleware } = require('../../middleware/authMiddleware');


// cart router
router.post('/add-to-cart', admin_middleware, cartController.add_to_cart);

router.get('/get-cart-product/:userId', admin_middleware, cartController.get_cart_products);

router.put('/quantity-inc/:cartId', admin_middleware, cartController.quantity_inc);

router.put('/quantity-dec/:cartId', admin_middleware, cartController.quantity_dec);

router.delete('/remove-form-cart/:cartId', admin_middleware, cartController.remove_form_cart);



module.exports = router;