const express = require('express');
const router = express.Router();
const likesCtrl = require('../controllers/likesCtrl');
const auth = require('../middleware/auth')



router.post('/messages/:messageId/vote/like', auth, likesCtrl.likePost);
router.post('/messages/:messageId/vote/dislike', auth, likesCtrl.dislikePost);

module.exports = router;