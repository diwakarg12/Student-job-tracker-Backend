const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log('Token', token);
        console.log('Cookies:',req.cookies)

        if (!token) {
            return res.status(401).json({ message: "No token found, Please Login Again" });
        }

        const decodedData = jwt.verify(token, "Diwakar@123");
        const _id = decodedData._id;

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "No user Found!" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
}

module.exports = userAuth;