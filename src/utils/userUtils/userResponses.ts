import { User } from "@prisma/client";
import { minimalUserResponse } from "../../types/userTypes";

/**
 * 
 * @param user user from form
 * @returns a minimal representation of a user
 */
export const minimalResponse = (user: User): minimalUserResponse  => {
    const data:minimalUserResponse = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        churchOfUser: user.churchOfUser
    }
    return data
}