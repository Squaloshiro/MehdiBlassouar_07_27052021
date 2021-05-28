const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const auth = require('../middleware/auth')



router.post('/users/register/', userCtrl.register);
router.post('/users/login/', userCtrl.login);
router.get('/users/me/', auth, userCtrl.getUserProfile);
router.put('/users/me/', auth, userCtrl.updateUserProfile);


module.exports = router;