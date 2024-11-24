import { Request, Response } from "express"
import { createUser, FindUser, UserServiceError } from "../services/userServices";
import { minimalResponse } from "../utils/userUtils/userResponses";
import { UserLoginData, UserRegistrationData } from "../types/userTypes";
import { validateLoginData, validateRegistrationData } from "../utils/userUtils/validate";
import { comparePassword, hashPassword } from "../utils/hashers";
import tokenService from "../utils/jwt";

//TODO: consider using middleware for error handling
//TODO: store refresh token as cookie in http response

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
            const tokens = tokenService.generateTokens({ userId: newUser?.id, fullName: newUser?.fullName })
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/api/auth/create'
            });
            return res.status(200).json(
                {
                    token: tokens.accessToken,
                    user: minimalResponse(newUser),
                }
            )
        }
    }
    catch (e) {
        if (e instanceof UserServiceError) {
            switch (e.code) {
                case "DUPLICATE_EMAIL":
                    return res.status(409).json({ "error": e.message })
                default:
                    return res.status(500).json({ "error": "Internal Server Error" })
            }
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
        const isValid = await comparePassword(user.password, validatedUser.password);
        
        if (isValid) {
            const tokens = tokenService.generateTokens({userId: validatedUser.id, fullName: validatedUser.fullName});
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/api/auth/login'
            });
    
            return res.status(200).json(
                { 
                    token: tokens.accessToken,
                    user:  minimalResponse(validatedUser)
                }
            )
        } else {
            return res.status(400).json({ error: "Invalid credentials" })
        }
    }
    catch (e) {
        if (e instanceof UserServiceError && e.code === "NOT_FOUND") {
            return res.status(400).json({ error: "Invalid credentials" })
        }
        else {
            console.log(e);
            return res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
}

export const RefreshToken = async (req:Request, res: Response): Promise<any>=> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not found' });
    }
    try {
        const accessToken = tokenService.refreshAccessToken(refreshToken);
        return res.status(200).send({accessToken})
    } catch(err) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/api/auth/refresh'
        });
        console.log(err);
        return res.status(500).send({"error": "Access token could not be generated"});
    }
}
