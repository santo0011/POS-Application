const router = require('express').Router();
const invoiceController = require('../../controller/Dashborad/invoiceController');
const { admin_middleware } = require('../../middleware/authMiddleware');


// invoice router
router.post('/create-invoice', admin_middleware, invoiceController.create_invoice);

router.get('/get-all-invoice', admin_middleware, invoiceController.get_all_invoice);



module.exports = router;