const express = require("express");
const router = express.Router();
const { getMe } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

router.get("/me", getMe, adminOnly, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
        message: "Welcome Admin"
    });
});
module.exports = router;