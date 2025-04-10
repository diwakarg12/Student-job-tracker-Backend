const express = require('express');
const userAuth = require('../middlewares/userAuth.middleware');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { updateValidation, updatePasswordValidation } = require('../utils/apiValidation');
const cloudinary = require('../configs/cloudinary');

const profileRouter = express.Router();

profileRouter.get('/view', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        if (!loggedInUser) {
            return res.status(404).json({ message: "Unable to Get user Data" })
        }

        res.status(200).json({ message: "User Data Fetched", user: loggedInUser })
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
});

profileRouter.patch('/edit', userAuth, async (req, res) => {
    try {
        // Validate the request body data
        const { name, age, gender, profile } = req.body;

        if (!name || !age || !gender) {
            return res.status(400).json({ message: "Name, Age, and Gender are required" });
        }

        // If the profile image starts with data:image (base64), we handle it
        if (profile && profile.startsWith("data:image")) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(profile);
                req.body.profile = uploadResponse.secure_url; // Update profile with the URL
            } catch (error) {
                return res.status(400).json({ message: "Error while uploading the profile image" });
            }
        }

        // Retrieve the current user
        const currentUser = req.user;
        Object.keys(req.body).forEach(key => {
            if (key !== 'profile' || req.body.profile) { // Avoid updating profile if it's not provided
                currentUser[key] = req.body[key];
            }
        });

        // Save the updated user data
        await currentUser.save();
        res.status(200).json({ message: `${currentUser.name} Your profile is updated successfully`, user: currentUser });
    } catch (error) {
        console.log(error); // Log error for debugging
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


profileRouter.patch('/change-password', userAuth, async (req, res) => {
    try {
        const currentUser = req.user;
        const { currentPass, newPass } = req.body;

        console.log('Received password update request:', { currentPass, newPass });

        const isPasswordCorrect = await bcrypt.compare(currentPass, currentUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const passwordHash = await bcrypt.hash(newPass, 10);

        console.log('Password hash generated:', passwordHash);

        currentUser.password = passwordHash;
        await currentUser.save();

        console.log(`${currentUser.name} has successfully updated the password`);

        res.status(200).json({ message: `${currentUser.name}, Your Password has been changed successfully!`, user: currentUser });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
});

profileRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Email id, Please provide the Correnct email Id");
        }

        const toEmail = email;
        const emailSubject = `Password Reset Request`;
        const emailBody = `
            Dear ${firstName},

            We received a request to reset the password for your account. If you made this request, please click the link below to reset your password:

            [Reset Your Password](#)

            This link will expire in 1 hour. If you did not request a password reset, please ignore this email, and your password will remain unchanged.

            If you have any questions or need further assistance, feel free to contact our support team at diwakargiri23@gmail.com.

            Thank you for being a part of STACKBUDDIES.

            Best regards,  
            STACKBUDDIES Support Team
            [Company Website]
        `;



    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
})


module.exports = profileRouter;