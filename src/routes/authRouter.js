const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { signupValidation, loginValidation } = require('../utils/apiValidation');
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {

    try {
        console.log('Log12');
        signupValidation(req.body);
        const { name, email, password, age, gender } = req.body;
        const existedUser = await User.findOne({ email: email });
        if (existedUser) {
            return res.status(400).json({ message: "User Already Existed, Please Login" })
        }
        console.log('Log1');
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            name: name,
            email: email,
            password: passwordHash,
            age: age,
            gender: gender
        });
        console.log('Log1');
        await user.save();
        console.log('Log1');

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('Ttoken', token);

        res.status(200).json({ message: "User Created Successfully", user: user })
    } catch (error) {
        res.status(500).json({ message: "Error:", error: error });
    }

});

authRouter.post('/login', async (req, res) => {
    try {
        loginValidation(req.body)
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials" })
        }

        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            return res.status(404).json({ message: "Invalid Credentials" })
        }

        const token = jwt.sign({ _id: user._id }, "Diwakar@123", { expiresIn: '1d' })
        console.log('Token', token)
        if (!token) {
            throw new Error("Error while Generating Token");
        }

        // res.cookie('token', token);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
        });
        res.status(200).json({ message: "Login Successfull", user: user })

    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
});

authRouter.post('/logout', async (req, res) => {
    const token = res.cookie('token', null, { expires: new Date(Date.now()) });
    res.status(200).json({ message: "user LoggedOut Successfully", user: null })
});

module.exports = authRouter;