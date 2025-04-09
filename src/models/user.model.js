const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "Other"],
            message: "{VALUE} is require"
        }
    },
    age: {
        type: String,
        require: true
    },
    profile: {
        type: String,
        default: "https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif"
    }
},{timestamps: true});

userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });

const User = new mongoose.model('User', userSchema);

module.exports = User;