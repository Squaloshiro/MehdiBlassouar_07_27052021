const express = require('express');
const router = express.Router();
const messageCrtl = require('../controllers/messagesController');
const auth = require('../middleware/auth')

router.post('/messages/new/', auth, messageCrtl.createMessage);
router.post('/messages/newimg/', auth, messageCrtl.createMessageImage);
router.get('/messages/', auth, messageCrtl.listMessages);
router.get('/messages/:id/', auth, messageCrtl.getOneMessage);
router.put('/messages/:id/', auth, messageCrtl.modifyMessage);

module.exports = router;