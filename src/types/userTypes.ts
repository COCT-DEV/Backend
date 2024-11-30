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

export type UserIdOnly = {
    UserId: string;
}
export type VerifyBody = {
    UserId: string,
    code: string
}
export type UpdatePassword = {
    password: string,
    confirm_password: string
}