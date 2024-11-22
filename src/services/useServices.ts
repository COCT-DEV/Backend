import { Prisma, User } from "@prisma/client";
import prisma from "../prisma/client";
import { UserRegistrationData } from "../types/userTypes";

//TODO: Hash the password before saving
//TODO:Include any default values required by your schema
//TODO:Handle unique constraint violations (especially for email)
//TODO:Validate all input data before attempting to create the user

type CreateUserInput = Omit<Prisma.UserCreateInput, 'createdAt'>;

export class UserServiceError extends Error {
    constructor(
        message: string,
        public code: 'DUPLICATE_EMAIL' | 'DATABASE_ERROR'
    ) {
        super(message);
        this.name = 'UserServiceError';
    }
}

export const createUser = async (data: CreateUserInput) => {
    try {
        const user = await prisma.user.create({
            data: data
        })
        return user
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
              throw new UserServiceError("User with this email already exists", "DUPLICATE_EMAIL")
          }
          else {
            throw new UserServiceError('An unexpected error occurred',"DATABASE_ERROR");
          }
        }
    }
}
