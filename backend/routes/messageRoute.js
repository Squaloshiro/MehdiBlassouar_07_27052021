const express = require('express');
const router = express.Router();
const messageCrtl = require('../controllers/messagesController');
const auth = require('../middleware/auth')
const multer = require('../middleware/multer_config')

router.post('/messages/new/', auth, messageCrtl.createMessage);
router.post('/messages/newimg/', auth, multer, messageCrtl.createMessageImage);
router.get('/messages/', auth, messageCrtl.listMessages);
router.get('/messages/user/', auth, messageCrtl.listMessagesUser);
router.get('/messages/:id/', auth, messageCrtl.getOneMessage);
router.put('/messages/:id/', auth, messageCrtl.modifyMessage);
router.delete('/messages/:id/', auth, messageCrtl.deleteOneMessage);

module.exports = router;