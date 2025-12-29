const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const validator = require("validator");

const tokenGenerator = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};
// Sign Up
exports.signUp = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        //To validate the  required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        // To validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email, Enter Correct Format"
            });
        }
        // To validate password
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and contain both letters and numbers"
            });
        }

        // checking for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // To Create user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        // Generate token
        const token = tokenGenerator(user._id);

        // Send response
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            },
            token
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Sign In
exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // To validate the required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        //To check if user exists or not
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        // To check if the account is active or not
        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated. Contact admin."
            });
        }
        // To compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        // To update the last login
        user.lastLogin = new Date();
        await user.save();
        // To generate the token
        const token = tokenGenerator(user._id);
        // To send the response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// =============Current User============
exports.getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};