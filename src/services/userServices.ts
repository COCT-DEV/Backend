import { Prisma, User } from "@prisma/client";
import prisma from "../prisma/client";
import { UserRegistrationData } from "../types/userTypes";

//BUG: cannot connect to database exception

type CreateUserInput = Omit<Prisma.UserCreateInput, 'createdAt' | 'role'>;

export class UserServiceError extends Error {
    constructor(
        message: string,
        public code: 'DUPLICATE_EMAIL' | 'DATABASE_ERROR' | 'NOT_FOUND'
    ) {
        super(message);
        this.name = 'UserServiceError';
    }
}

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
