const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: String,
    email: String(unique),
    password: String(hashed),
    role: "admin" | "user",
    status: "active" | "inactive",
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date,

});