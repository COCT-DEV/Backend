import { Request, Response } from "express"
import { ChangeUserPassword, createUser, DeleteUserData, FindUser, FindUserById, UpdateUserData, UpdateUserPassword, UserServiceError } from "../services/userServices";
import { minimalResponse } from "../utils/userUtils/userResponses";
import { ChangePasswordData, UpdatePasswordData, UserEmailOnly, UserIdOnly, UserLoginData, UserRegistrationData, UserUpdateData, VerifyBody } from "../types/userTypes";
import { validateLoginData, validateRegistrationData, validateUpdateData, validateUpdatePassword } from "../utils/userUtils/validate";
import { comparePassword, hashPassword } from "../utils/hashers";
import tokenService from "../utils/jwt";
import { error } from "console";
import e from "cors";
import { OtpServiceError, ServiceErrorCode } from "../utils/errors/ServiceErrors";
import { generateOTP, verifyOTP } from "../services/otpService";

//TODO: consider using middleware for error handling
//TODO: store refresh token as cookie in http response
//TODO: Clean try catch feels a bit redundant
//TODO; Clean up the asking for ids feel like there is a better way

export const RegisterUser = async (req: Request, res: Response): Promise<any> => {
    const reqData = req.body as UserRegistrationData;

    const validation = validateRegistrationData(reqData);
    if (!validation.isValid) {
        return res.status(400).json({
            error: validation.error,
        })
    }
    try {
        const { confirm_password, ...UserData } = reqData;
        UserData.password = (await hashPassword(UserData.password)).toString();
        const newUser = await createUser(UserData);

        if (newUser) {
            await generateOTP(newUser.id, newUser.email, 'SignUpOTP');
            return res.status(200).json({
                message: 'An otp message has been sent to your mail',
                userId: newUser?.id
            })
        }
    }
    catch (e) {
        if (e instanceof UserServiceError) {
            return res.status(e.errCode).json({ error: e.message })
        }
        else if (e instanceof OtpServiceError) {
            return res.status(e.errCode).json({ error: e.message })
        } else {
            return res.status(500).json({ "error": "Internal Server Error" })
        }
    }
}

export const LoginUser = async (req: Request, res: Response): Promise<any> => {
    const user = req.body as UserLoginData;
    const validation = validateLoginData(user);
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.error })
    }
    try {
        const validatedUser = await FindUser(user.email);
        const isValid = await comparePassword(user.password, validatedUser!.password);
        if (!validatedUser.isVerified) {
            return res.status(403).json({
                "message": "Verify account to login"
            })
        }
        if (isValid && validatedUser?.password) {
            const tokens = tokenService.generateTokens({ userId: validatedUser.id, fullName: validatedUser.fullName });
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json(
                {
                    token: tokens.accessToken,
                    user: minimalResponse(validatedUser)
                }
            )
        } else {
            return res.status(400).json({ error: "Invalid credentials" })
        }
    }
    catch (e) {
        if (e instanceof UserServiceError) {
            return res.status(e.errCode).json({ error: e.message })
        }
        else {
            return res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
}

export const RefreshToken = async (req: Request, res: Response): Promise<any> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not found' });
    }
    try {
        const accessToken = tokenService.refreshAccessToken(refreshToken);
        return res.status(200).send({ accessToken })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: "Access token could not be generated" });
    }
}


export const UpdateUser = async (req: Request, res: Response): Promise<any> => {
    const userData = req.body as UserUpdateData;
    const validated = validateUpdateData(userData);

    if (!validated.isValid) {
        return res.status(400).json({ error: validated.error })
    }

    try {
        const foundUser = await FindUserById(userData.userId);
        if (foundUser) {
            const updatedUser = minimalResponse(await UpdateUserData(userData));
            return res.status(202).json({
                user: updatedUser
            })
        } else {
            throw new UserServiceError("User not found", ServiceErrorCode.USER_NOT_FOUND, 409);
        }
    } catch (err) {
        if (err instanceof UserServiceError) {
            return res.status(err.errCode).json({ "error": err.message })
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}


export const DeleteUser = async (req: Request, res: Response): Promise<any> => {
    const { UserId } = req.body as UserIdOnly;

    if (!UserId) {
        return res.status(400).json({ error: "User id is required" })
    }

    try {
        const foundUser = await FindUserById(UserId);
        if (foundUser) {
            await DeleteUserData(UserId);
            return res.sendStatus(204);
        } else {
            throw new UserServiceError("User not found", ServiceErrorCode.USER_NOT_FOUND, 409);
        }
    } catch (err) {
        if (err instanceof UserServiceError) {
            return res.status(err.errCode).json({ error: err.message })
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}


export const VerifyUser = async (req: Request, res: Response): Promise<any> => {
    const { email, code } = req.body as VerifyBody;

    if (!email || !code) {
        return res.status(400).json({ error: "Invalid credentials" })
    }
    if (typeof (code) !== 'string') {
        return res.status(400).json({ error: "OTP code must be string" })
    }
    try {
        const user = await FindUser(email);
        const isVerified = await verifyOTP(user.id, code, 'SignUpOTP');
        if (isVerified) {
            return res.status(201).json({
                user: minimalResponse(user)
            })
        }

    } catch (err) {
        if (err instanceof OtpServiceError) {
            return res.status(err.errCode).json({ error: err.message })
        }
        else {
            return res.status(500).json({ error: "An unexpected error occurred" })
        }
    }
}

export const newVerifyOtp = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body as UserEmailOnly;
    if (!email) {
        return res.status(400).json({ 'error': "Email is required" });
    }
    try {
        const user = await FindUser(email);
        if (user) {
            await generateOTP(user?.id, user.email, 'SignUpOTP');
            return res.status(200).json(
                { message: 'A new otp has been sent' }
            )
        }
    }
    catch (err) {
        if (err instanceof OtpServiceError) {
            return res.status(err.errCode).json({ error: err.message })
        }
        else {
            return res.status(500).json({ error: "An unexpected error occurred" })
        }
    }
}

export const passwordUpdateOTP = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body as UserEmailOnly;
    if (!email) {
        return res.status(400).json({ 'error': "Email is required" });
    }
    try {
        const user = await FindUser(email);
        if (user) {
            await generateOTP(user?.id, user.email, 'PasswordOTP');
            return res.status(200).json(
                { message: 'A  reset otp has been sent' }
            )
        }
    }
    catch (err) {
        if (err instanceof OtpServiceError) {
            return res.status(err.errCode).json({ error: err.message })
        }
        else {
            return res.status(500).json({ error: "An unexpected error occurred" })
        }
    }
}


export const ResetPassword = async (req: Request, res:Response): Promise<any> => {
    const data = req.body as UpdatePasswordData;
    const validated = validateUpdatePassword(data);
    if (!validated.isValid) {
        return res.status(400).json({ error: validated.error })
    } 
    try {
        const user = await FindUser(data.email)
        const result = await verifyOTP(user.id, data.code, 'PasswordOTP');
        if (result) {
            await UpdateUserPassword(data);
            return res.sendStatus(204);
        }
    } catch (err) {
        if (err instanceof OtpServiceError) {
            return res.status(err.errCode).json({ error: err.message })
        }
        else {
            return res.status(500).json({ error: "An unexpected error occurred" })
        }
    }
}

//FIX: heck userId in payload rather
export const ChangePassword = async (req:Request, res:Response): Promise<any> => {
    const data = await req.body as ChangePasswordData;
    if (!data.password && !data.confirm_password) {
        return res.status(400).json({error: "Password and confirm password are required"});
    };

    if (!data.UserId) {
        return res.status(400).json({error:"User Id is required"});
    }
    if (data.password !== data.confirm_password) {
        return res.status(400).json({error: "Passwords must match"});
    };
    try {
        ChangeUserPassword(data);
        return res.sendStatus(204);
    } catch (err) {
        if (err instanceof UserServiceError)
        {
            return res.status(err.errCode).json({error: err.message})
        }
        return res.status(400).json({"error": "An unexpected error occurred"})
    }
}