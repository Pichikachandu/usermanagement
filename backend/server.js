require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./app");

// Connect to Database
connectDB();

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
    res.json({
        message: "Mini User Management System API is running",
        status: "Online",
        version: "1.0.0"
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});