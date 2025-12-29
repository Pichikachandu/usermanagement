const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.getMe = async (req, res, next) => {
    try {
        let token;
        // To get the token from the header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, token Missing"
            })
        }

        // To verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // to get user from token
        const user = await User.findById(decodedToken.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated"
            });
        }
        // To add user to req object             
        req.user = user;
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}