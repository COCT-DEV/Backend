import { Prisma, User } from "@prisma/client";
import prisma from "../prisma/client";
import { ChangePasswordData, UpdatePasswordData, UserUpdateData } from "../types/userTypes";
import { ServiceErrorCode, UserServiceError } from "../utils/errors/ServiceErrors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hashPassword } from "../utils/hashers";


type CreateUserInput = Omit<Prisma.UserCreateInput, 'createdAt' | 'role'>;

export const createUser = async (data: CreateUserInput) => {
    try {
        const memberRole = await prisma.userRoles.upsert({
            where: { name: "MEMBER" },
            update: {},
            create: { name: "MEMBER" }
        });

        const user = await prisma.user.create({
            data: {
                ...data,
                role: {
                    connect: { id: memberRole.id }
                }
            }
        });
        return user;

    } catch (e) {
        console.error(e);
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                throw new UserServiceError("User with this email already exists", ServiceErrorCode.DUPLICATE_EMAIL, 409)
            }
            throw new UserServiceError('An unexpected error occurred', ServiceErrorCode.DATABASE_ERROR, 500);
        }
        throw new UserServiceError('An unexpected error occurred', ServiceErrorCode.DATABASE_ERROR, 500);
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
            throw new UserServiceError("User does not exist", ServiceErrorCode.USER_NOT_FOUND, 409);
        }
        return user;
    }
    catch (err) {
        console.log(err)
        if (err instanceof UserServiceError) {
            throw new UserServiceError(err.message, err.code, 500);
        }
        throw new UserServiceError("An unexpected error occurred", ServiceErrorCode.DATABASE_ERROR, 500);
    }
}

export const FindUserById = async (id: string) => {
    if (!id) {
        throw new UserServiceError("User ID is required", ServiceErrorCode.USER_INVALID_DETAILS, 400);
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new UserServiceError("User not found", ServiceErrorCode.HYMN_NOT_FOUND, 409);
        }
        return user;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2023') {
                throw new UserServiceError("User ID is invalid", ServiceErrorCode.USER_INVALID_DETAILS, 409)
            }
        }
        else if (err instanceof UserServiceError) {
            throw new UserServiceError(err.message, err.code, 500);
        } else {
            throw new UserServiceError("An unexpected error occurred", ServiceErrorCode.DATABASE_ERROR, 500);
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
                throw  new UserServiceError('User Account could not be deleted', ServiceErrorCode.USER_NOT_FOUND, 409)
            } else {
                throw new UserServiceError('A unexpected error occurred', ServiceErrorCode.DATABASE_ERROR, 500)
            }
        } else {
            console.log(err);
            throw new UserServiceError("An unexpected error occurred", ServiceErrorCode.DATABASE_ERROR, 500)
        }
    }
}

export const UpdateUserData = async (data: UserUpdateData) => {
    try {
        let {['userId']:_, ...result} = data
        const updatedUser = await prisma.user.update({
            where: {
                id: data.userId
            },
            data: {
                ...result
            }
        })
        return updatedUser;
    } catch (err) {
        throw new UserServiceError("A unexpected error occurred", ServiceErrorCode.DATABASE_ERROR, 500)
    }
}


export const UpdateUserPassword = async (data: UpdatePasswordData) => {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                email: data.email
            }, 
            data: {
                password: await hashPassword(data.password)
            }
        })
        return updatedUser;
    }
    catch (err) {
        throw new UserServiceError("A unexpected error occurred", ServiceErrorCode.DATABASE_ERROR, 500)
    }
}

export const ChangeUserPassword = async (data:ChangePasswordData) => {
    try {
        await prisma.user.update({
            where: {
                id: data.UserId
            }, 
            data: {
                password: await hashPassword(data.password)
            }
        })
    }
    catch (err) {
        throw new UserServiceError("A unexpected error occurred", ServiceErrorCode.DATABASE_ERROR, 500)
    }
}

export { UserServiceError };
