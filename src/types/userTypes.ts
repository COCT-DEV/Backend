export type UserRegistrationData = {
    fullName: string;
    email: string;
    password: string;
    confirm_password: string;
    phoneNumber: string;
    churchOfUser: string;
}

export type minimalUserResponse = {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    churchOfUser: string;
}