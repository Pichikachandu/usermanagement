const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
    try {
        // Read pagination query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total users count
        const totalUsers = await User.countDocuments();

        // Fetch users (exclude password)
        const users = await User.find()
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Response
        res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


// ACTIVATE USER
exports.activateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.status = "active";
        await user.save();

        res.status(200).json({
            success: true,
            message: "User activated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to activate user",
            error: error.message
        });
    }
};



// DEACTIVATE USER
exports.deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.status = "inactive";
        await user.save();

        res.status(200).json({
            success: true,
            message: "User deactivated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to deactivate user",
            error: error.message
        });
    }
};