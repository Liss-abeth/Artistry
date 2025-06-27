const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uname: { type: String },
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "artist", "admin"], default: "user" },
    contactNumber: { type: String },
    address: { type: String },
    profilePicture: { type: String },
    artistBio: { type: String },
    portfolioLink: { type: String },
    location: { type: String }
}, { timestamps: true });

const userModel = new mongoose.model('registration', userSchema);

module.exports = userModel;
