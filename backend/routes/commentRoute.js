const express = require('express');
const router = express.Router();
const commentCrtl = require('../controllers/commentctrl');
const auth = require('../middleware/auth')

router.post('/comment/', auth, commentCrtl.createcomment);
router.get('/comment/', auth, commentCrtl.listComments);
router.get('/comment/user/', auth, commentCrtl.listCommentsUser);
router.get('/comment/:id', auth, commentCrtl.getOneComment);
router.put('/comment/:id', auth, commentCrtl.modifyComment);
router.delete('/comment/:messageId/:id', auth, commentCrtl.deleteOneComment);

module.exports = router;