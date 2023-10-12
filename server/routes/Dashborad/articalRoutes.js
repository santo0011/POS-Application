const router = require('express').Router();
const articalController = require('../../controller/Dashborad/articalController');
const { admin_middleware } = require('../../middleware/authMiddleware');


router.post('/add-artical', admin_middleware, articalController.add_artical);

router.get('/get-artical', admin_middleware, articalController.get_artical);

router.get('/edit-artical/:articleSlug', admin_middleware, articalController.edit_artical);

router.post('/update-artical', admin_middleware, articalController.update_artical);

router.delete('/delete-artical/:articleId', admin_middleware, articalController.delete_artical);


module.exports = router;