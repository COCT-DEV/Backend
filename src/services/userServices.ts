import { Prisma, User } from "@prisma/client";
import prisma from "../prisma/client";
import { UserRegistrationData, UserUpdateData } from "../types/userTypes";
import { UserServiceError } from "../utils/errors/ServiceErrors";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


type CreateUserInput = Omit<Prisma.UserCreateInput, 'createdAt' | 'role'>;

export const createUser = async (data: CreateUserInput) => {
    try {
        let memberRole = await prisma.userRoles.findFirst({
            where: {name: "MEMBER"}
        });
        if (!memberRole) {
            prisma.userRoles.create({
                data: {
                    name: "MEMBER"
                }
            })
        }
        const user = await prisma.user.create({
            data: {
                ...data,
                role: {
                    connect: { id: memberRole?.id } 
                }
            }
        })
        return user;
    } catch (e) {
        console.log(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                throw new UserServiceError("User with this email already exists", "DUPLICATE_EMAIL")
            }
            else {
                throw new UserServiceError('An unexpected error occurred', "DATABASE_ERROR");
            }
        }
        else {
            console.log(`creation Error: ${e}`)
        }
    }
}

export const FindUser = async (email: string) => {
    if (!email) {
        throw new Error("a value for user email is required")
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })
        if (user === null) {
            throw new UserServiceError("User does not exist", "NOT_FOUND");
        }
        return user;
    }
    catch (err) {
        console.log(err)
        if (err instanceof UserServiceError) {
            throw new UserServiceError(err.message, err.code);
        }
        throw new UserServiceError("An unexpected error occurred", 'DATABASE_ERROR');
    }
}

export const FindUserById = async (id: string) => {
    if (!id) {
        throw new UserServiceError("User ID is required", 'INVALID_DETAILS');
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        
        if (!user) {
            throw new UserServiceError("User not found", "NOT_FOUND");
        }
        return user;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2023') {
                throw new UserServiceError("User ID is invalid", 'INVALID_DETAILS')
            }
        }
        else if (err instanceof UserServiceError) {
            throw new UserServiceError(err.message, err.code);
        } else {
            throw new UserServiceError("An unexpected error occurred", 'DATABASE_ERROR');
        }
    }
}

export const DeleteUserData = async (id: string) => {
    try {
        await prisma.user.delete({
            where:{id: id}
        })
    } catch(err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                throw  new UserServiceError('User Account could not be deleted', 'NOT_FOUND')
            } else {
                throw new UserServiceError('A unexpected error occurred', 'DATABASE_ERROR')
            }
        } else {
            console.log(err);
            throw new UserServiceError("An unexpected error occurred", 'DATABASE_ERROR')
        }
    }
}

export const UpdateUserData = async (data: UserUpdateData) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: data.id
            },
            data: {
                ...data
            }
        })
        return updatedUser;
    } catch (err) {
        throw new UserServiceError("A unexpected error occurred", 'DATABASE_ERROR')
    }
}

export { UserServiceError };
