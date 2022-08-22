const { Router } = require('express');
const { auth } = require('../middleware/auth');
const reviewController = require('../controllers/reviewContollers');
const router = Router();

router.get('/review/all', reviewController.get_review);
router.post('/review/post-new', auth, reviewController.post_review);
router.patch('/review/edit/:id', auth, reviewController.edit_review);
router.delete('/review/delete/:id', auth, reviewController.delete_review);
router.patch('/review/helpful/:id', reviewController.find_helpful);

module.exports = router;