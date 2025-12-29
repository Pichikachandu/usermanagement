const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const validator = require("validator");

const tokenGenerator = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

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
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // checking for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
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