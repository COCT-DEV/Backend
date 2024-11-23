"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginData = exports.validateRegistrationData = void 0;
/**
 *
 * @param userInfo User registration info
 * @returns validation error messages
 * @description Validates the user data received from request
 */
//TODO: validate everything as one
const validateRegistrationData = (userInfo) => {
    const requiredFields = [
        "fullName",
        "email",
        "password",
        "confirm_password",
        "phoneNumber",
        "churchOfUser",
    ];
    for (let field of requiredFields) {
        if (!userInfo[field]) {
            return { isValid: false, error: `${field} is required` };
        }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!emailRegex.test(userInfo.email)) {
        return { isValid: false, error: "Invalid email format" };
    }
    if (!phoneRegex.test(userInfo.phoneNumber)) {
        return { isValid: false, error: "Invalid phone number format" };
    }
    if (userInfo.password.length < 8) {
        return { isValid: false, error: "Password must be greater than 8" };
    }
    if (userInfo.confirm_password !== userInfo.password) {
        return { isValid: false, error: "Passwords must match" };
    }
    return { isValid: true };
};
exports.validateRegistrationData = validateRegistrationData;
const validateLoginData = (userInfo) => {
    const requiredFields = ["password", "email"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const field of requiredFields) {
        if (!userInfo[field]) {
            return { isValid: false, error: `${field} is required` };
        }
    }
    if (!emailRegex.test((userInfo.email))) {
        return { isValid: false, error: "Invalid email format" };
    }
    if (userInfo.password.length < 8) {
        return { isValid: false, error: "Password must be greater than 8" };
    }
    return { isValid: true };
};
exports.validateLoginData = validateLoginData;
