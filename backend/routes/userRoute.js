const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/users/register/", userCtrl.register);
router.post("/users/login/", userCtrl.login);
router.get("/users/me/", auth, userCtrl.getUserProfile);
router.get("/users/:id/", auth, userCtrl.getUserData);
router.put("/users/me/", auth, userCtrl.updateUserProfile);
router.put("/users/:id/", auth, userCtrl.updateUserAdmin);
router.put("/users/password/", auth, userCtrl.updateUserPassword);
router.delete("/users/:id/", auth, userCtrl.deleteUserProfile);

module.exports = router;
