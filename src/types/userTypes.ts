export type UserRegistrationData = {
    fullName: string;
    email: string;
    password: string;
    confirm_password: string;
    phoneNumber: string;
    churchOfUser: string;
}

export type UserLoginData = {
    email: string,
    password: string
}
export type minimalUserResponse = {
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    churchOfUser: string;
    role_id: number;
}

export type UserUpdateData = {
    UserId: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    churchOfUser?: string;   
}
//FIXME: These are shitty clean them up
export type UserIdOnly = {
    UserId: string;
}
export type UserEmailOnly = {
    email: string
}
export type VerifyBody = {
    email: string,
    code: string
}
export type UpdatePasswordData = {
    email: string,
    code: string, // the OTP sent to user
    password: string;
    confirm_password: string;
}