const express = require("express");
const router = express.Router();
const { getMe } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");
const {
    getAllUsers,
    activateUser,
    deactivateUser
} = require("../controllers/adminController");
router.get("/me", getMe, adminOnly, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
        message: "Welcome Admin"
    });
});
// View users
router.get("/users", getMe, adminOnly, getAllUsers);
// Activate user
router.put("/activate/:id", getMe, adminOnly, activateUser);
// Deactivate user
router.put("/deactivate/:id", getMe, adminOnly, deactivateUser);
module.exports = router;    