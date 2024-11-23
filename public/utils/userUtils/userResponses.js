"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimalResponse = void 0;
/**
 *
 * @param user user from form
 * @returns a minimal representation of a user
 */
const minimalResponse = (user) => {
    const data = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        churchOfUser: user.churchOfUser
    };
    return data;
};
exports.minimalResponse = minimalResponse;
