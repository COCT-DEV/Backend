import { OtpType, Prisma } from "@prisma/client"
import dotenv from "dotenv"
import { authenticator } from 'otplib';
import prisma from "../prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { OtpServiceError, ServiceErrorCode, UserServiceError } from "../utils/errors/ServiceErrors";
import { sendMail } from "../utils/MailUtils/sendMail";

//TODO: possible fix include error codes in otp
//FIXME: Use time based otp generation
dotenv.config()

export const generateOTP = async (userId: string, email: string,type:OtpType) => {
    const secret = process.env.OTP_SECRET;

    if (!secret) {
        throw new OtpServiceError('OTP secret not configured', ServiceErrorCode.UNKNOWN_ERROR, 500);
    }


    const token = authenticator.generate(secret);

    try {
        await prisma.otp.create({
            data: {
                user_id: userId,
                code: token,
                otpType:type
            }
        })
        sendMail(email, token, type);
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                throw new OtpServiceError("An otp has already been sent", ServiceErrorCode.OTP_EXISTS, 409)
            }
            else if (err.code === 'P2003') {
                throw new OtpServiceError(err.message, ServiceErrorCode.DATABASE_ERROR, 500)
            }
            else if (err instanceof OtpServiceError && err.code === 'MAIL_ERROR') {
                return err
            } else{
                console.log(err)
                throw new OtpServiceError('Unexpected error:'+ err.meta?.message,ServiceErrorCode.DATABASE_ERROR, 500);
            }
        } 
        else {
            return new OtpServiceError("An unknown error occurred", ServiceErrorCode.UNKNOWN_ERROR, 500)
        }
    }
}

export const verifyOTP = async (userId: string, token: string, type: OtpType): Promise<boolean> => {
    const secret = process.env.OTP_SECRET;

    if (!secret) {
        throw new OtpServiceError('OTP secret not configured', ServiceErrorCode.CONFIGURATION_ERROR, 500);
    }

    try {
        const otpRecord = await prisma.otp.findFirst({
            where: {
                user_id: userId,
                code: token,
                otpType: type,
            },
        });

        if (!otpRecord) {
            throw new OtpServiceError('Invalid OTP or not found', ServiceErrorCode.OTP_INVALID_DETAILS, 409);
        }

        const currentTime = new Date();
        const otpCreatedAt = otpRecord?.created_at;

        if (otpCreatedAt){
            const expirationMinutes = 10; // OTP valid for 10 minutes
            const timeDiff = (currentTime.getTime() - otpCreatedAt.getTime()) / (1000 * 60);
            if (timeDiff > expirationMinutes) {
                await prisma.otp.delete({
                    where: { id: otpRecord.id },
                });
                throw new OtpServiceError('OTP has expired', ServiceErrorCode.OTP_INVALID_DETAILS, 409);
            }
        }


        if (otpRecord.code !== token) {
            throw new OtpServiceError('OTP is invalid', ServiceErrorCode.OTP_INVALID_DETAILS, 409);
        }
       await prisma.user.update({
            where: {id: userId},
            data:{
                isVerified: true,
            }
        })

        await prisma.otp.delete({
            where: { id: otpRecord.id },
        });

        return true;
    } catch (err: unknown) {
        if (err instanceof OtpServiceError) {
            throw err;
        }

        if (err instanceof PrismaClientKnownRequestError) {
            switch (err.code) {
                case 'P2025':
                    throw new OtpServiceError('OTP does not exist for the user', ServiceErrorCode.OTP_NOT_FOUND, 409);
                case 'P2002':
                    throw new OtpServiceError('OTP already exists for the user', ServiceErrorCode.OTP_EXISTS, 409);
                default:
                    console.log(err)
                    throw new OtpServiceError('Unexpected error:'+ err.meta?.message, ServiceErrorCode.DATABASE_ERROR, 500);
            }
        }

        if (err instanceof Error) {
            console.log(err)
            throw new OtpServiceError('Unexpected error occurred' , ServiceErrorCode.UNKNOWN_ERROR, 500);
        }

        throw new OtpServiceError('An unknown error occurred', ServiceErrorCode.UNKNOWN_ERROR, 500);
    }
};



