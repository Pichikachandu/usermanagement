const express = require("express");
const router = express.Router();
const { getMe } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const { getAllUsers } = require("../controllers/adminController");

router.get("/me", getMe, adminOnly, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
        message: "Welcome Admin"
    });
});
router.get("/users", getMe, adminOnly, getAllUsers);
module.exports = router;