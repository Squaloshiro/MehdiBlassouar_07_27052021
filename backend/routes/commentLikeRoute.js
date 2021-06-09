const express = require('express');
const router = express.Router();
const commentLikesCtrl = require('../controllers/commentLikeCtrl');
const auth = require('../middleware/auth')



router.post('/comment/:commentId/vote/like', auth, commentLikesCtrl.likePost);
router.post('/comment/:commentId/vote/dislike', auth, commentLikesCtrl.dislikePost);

module.exports = router;