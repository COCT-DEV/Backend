import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { OtpType } from '@prisma/client';
import { resetPasswordTemplate, signUpTemplate } from './templates';
import { OtpServiceError, ServiceErrorCode } from '../errors/ServiceErrors';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chruchofchristapp@gmail.com',
        pass: process.env.APP_PASSWORD,
    },
});

export const sendMail = async (receiver: string, token: string, type: OtpType): Promise<void> => {
    const mailData = {
        from: 'chruchofchristapp@gmail.com',
        to: receiver,
        subject: type === 'SignUpOTP' ? 'Church Of Christ Verification' : 'Password Reset Token',
        html: type === 'SignUpOTP' ? signUpTemplate(token) : resetPasswordTemplate(token),
    };

    try {
        await transporter.sendMail(mailData);
    } catch (err) {
        console.error('Error sending email:', err);
        throw new OtpServiceError('Email could not be sent', ServiceErrorCode.MAIL_ERROR, 500);
    }
};
