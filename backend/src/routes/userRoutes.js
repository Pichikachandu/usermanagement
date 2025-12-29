const express = require("express");
const { getMe } = require("../middlewares/authMiddleware");
const {
    getProfile,
    updateProfile,
    changePassword
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", getMe, getProfile);
router.put("/profile", getMe, updateProfile);
router.put("/change-password", getMe, changePassword);

module.exports = router;
