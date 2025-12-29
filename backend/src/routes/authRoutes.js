const express = require("express");
const { signUp, signIn, getCurrentUser, logout } = require("../controllers/authController");
const { getMe } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", getMe, getCurrentUser);
router.post("/logout", logout);

module.exports = router;
