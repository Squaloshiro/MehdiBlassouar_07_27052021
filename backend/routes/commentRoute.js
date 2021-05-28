const express = require('express');
const router = express.Router();
const commentCrtl = require('../controllers/commentctrl');
const auth = require('../middleware/auth')

router.post('/comment/', auth, commentCrtl.createcomment);
router.get('/comment/', auth, commentCrtl.listComments);
router.get('/comment/:id', auth, commentCrtl.getOneComment);
router.put('/comment/me', auth, commentCrtl.modifyComment);

module.exports = router;