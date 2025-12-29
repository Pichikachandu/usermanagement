const validator = require("validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email,
                role: req.user.role,
                status: req.user.status,
                lastLogin: req.user.lastLogin,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, email } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: "Full name and email are required"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Check if email already exists
        const emailExists = await User.findOne({
            email,
            _id: { $ne: req.user._id }
        });

        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: "Email already in use"
            });
        }

        req.user.fullName = fullName;
        req.user.email = email;
        await req.user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: req.user._id,
                fullName: req.user.fullName,
                email: req.user.email,
                role: req.user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};

// Change Password  
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both current and new passwords are required"
            });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters long and contain both letters and numbers"
            });
        }

        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
};