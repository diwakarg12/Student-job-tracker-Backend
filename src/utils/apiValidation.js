const express = require('express');
const validator = require('validator');

const signupValidation = (data) => {
    const { name, email, password, age, gender } = data;
    const allowedGender = ['male', 'female', 'other'];
    if (!validator.isLength(name, { min: 3, max: 20 })) {
        throw new Error("FirstName should be between 3 to 20 Characters");
    } else if (!validator.isEmail(email)) {
        throw new Error("Email is not Valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("password is not Valid");
    } else if (!validator.isInt(age.toString(), { min: 18 })) {
        throw new Error("Use should be more than 18 yrs old");
    } else if (!allowedGender.includes(gender)) {
        throw new Error("Gender is not Valid");
    }
};

const loginValidation = (data) => {
    const { email, password } = data;

    if (!validator.isEmail(email)) {
        throw new Error("Email is not Valid");

    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not Valid");
    }
};

function isValidImageUrlOrBase64(str) {
    const isImageUrl = validator.isURL(str, { require_protocol: true }) && /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(str);
    const isBase64 = /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,/i.test(str);
    return isImageUrl || isBase64;
};

const updateValidation = (data) => {
    const updatable = ["name", "gender", "age", "profileUrl"];

    const isUpdatable = Object.keys(data).every(req => updatable.includes(req))
    if (!isUpdatable) {
        throw new Error("Invalid Update Request");
    } else if (data.firstName && !validator.isLength(data.firstName, { min: 3, max: 20 })) {
        throw new Error("firstName should be between 3 to 20 Characters");
    } else if (data.lastName && !validator.isLength(data.lastName, { min: 3, max: 20 })) {
        throw new Error("firstName should be between 3 to 20 Characters");
    } else if (data.age && !validator.isInt(data.age.toString(), { min: 18 })) {
        throw new Error("Age should be more than 18 Years");
    } else if (data.about && !validator.isLength(data.about, { min: 20, max: 400 })) {
        throw new Error("About should be between 20 to 400 Character");
    } else if (data.skills && data.skills.length > 10) {
        throw new Error("Skills Should be less than 10");
    } else if (data.profileUrl && !isValidImageUrlOrBase64(data.profileUrl)) {
        throw new Error("Invalid profile URL");
    }
};

const updatePasswordValidation = (password) => {
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not Valid");
    }
};

const applyJob = (data) => {
    const { company, role, salary, location } = data;

    if (!validator.isLength(company, { min: 3, max: 20 })) {
        throw new Error('company Name should be between 3 to 20 Characters')
    } else if (!validator.isLength(role, { min: 3, max: 20 })) {
        throw new Error('Role should be between 3 to 20 Characters');
    } else if (!validator.isLength(salary, { min: 3, max: 20 })) {
        throw new Error('Status should be between 3 to 20 Characters');
    } else if (!validator.isLength(location, { min: 3, max: 20 })) {
        throw new Error('Status should be between 3 to 20 Characters');
    }
};

module.exports = {
    applyJob,
    signupValidation,
    loginValidation,
    updateValidation,
    updatePasswordValidation
};