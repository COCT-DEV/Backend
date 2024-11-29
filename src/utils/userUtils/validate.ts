import { UserLoginData, UserRegistrationData, UserUpdateData } from "../../types/userTypes";

/**
 *
 * @param userInfo User registration info
 * @returns validation error messages
 * @description Validates the user data received from request
 */

//TODO: validate everything as one
//TODO: Think of a better way to handle this
export const validateRegistrationData = (
	userInfo: UserRegistrationData
): { isValid: boolean; error?: string } => {
	const requiredFields = [
		"fullName",
		"email",
		"password",
		"confirm_password",
		"phoneNumber",
		"churchOfUser",
	];

	for (let field of requiredFields) {
		if (!userInfo[field as keyof UserRegistrationData]) {
			return { isValid: false, error: `${field} is required` };
		}
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const phoneRegex = /^\+?[\d\s-]{10,}$/;

	if (!emailRegex.test(userInfo.email)) {
		return { isValid: false, error: "Invalid email format" };
	}
	if (typeof(userInfo.phoneNumber) !== "string") {
		return { isValid: false, error: "Phone number must be a string" };
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

export const validateLoginData = (userInfo: UserLoginData): { isValid: boolean; error?: string } => {
	const requiredFields = ["password", "email"]
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	
	for (const field of requiredFields) {
		if(!userInfo[field as keyof UserLoginData]) {
			return {isValid: false, error:`${field} is required`}
		}
	}
	if (!emailRegex.test((userInfo.email))) {
		return { isValid: false, error: "Invalid email format" };	
	}
	if (userInfo.password.length < 8) {
		return { isValid: false, error: "Password must be greater than 8" };
	}
	return {isValid: true};
}

export const validateUpdateData = (
	userInfo: UserUpdateData
): { isValid: boolean; error?: string } => {
	const requiredFields: (keyof UserUpdateData)[] = ["id"];


	for (let field of requiredFields) {
		if (!userInfo[field as keyof UserUpdateData]) {
			return { isValid: false, error: `${field} is required` };
		}
	}


	const updatableFields: (keyof UserUpdateData)[] = ["fullName", "email", "phoneNumber", "churchOfUser"];
    const hasUpdateField = updatableFields.some(field => 
        field in userInfo && userInfo[field]?.toString().trim() !== ""
    );

    if (!hasUpdateField) {
        return { isValid: false, error: "At least one valid field is required" };
    }

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const phoneRegex = /^\+?[\d\s-]{10,}$/;

	if (userInfo.email && !emailRegex.test(userInfo.email)) {
		return { isValid: false, error: "Invalid email format" };
	}
	if (userInfo.phoneNumber && typeof(userInfo.phoneNumber) !== "string") {
		return { isValid: false, error: "Phone number must be a string" };
	}
	if (userInfo.phoneNumber && !phoneRegex.test(userInfo.phoneNumber)) {
		return { isValid: false, error: "Invalid phone number format" };
	}

	return { isValid: true };
};