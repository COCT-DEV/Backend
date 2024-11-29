import { Request, Response } from "express"
import { createUser, DeleteUserData, FindUser, FindUserById, UpdateUserData, UserServiceError } from "../services/userServices";
import { minimalResponse } from "../utils/userUtils/userResponses";
import { DeleteData, UserLoginData, UserRegistrationData, UserUpdateData } from "../types/userTypes";
import { validateLoginData, validateRegistrationData, validateUpdateData } from "../utils/userUtils/validate";
import { comparePassword, hashPassword } from "../utils/hashers";
import tokenService from "../utils/jwt";
import { error } from "console";
import e from "cors";

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
        const isValid = await comparePassword(user.password, validatedUser!.password);
        
        if (isValid && validatedUser?.password) {
            const tokens = tokenService.generateTokens({userId: validatedUser.id, fullName: validatedUser.fullName});
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
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
        console.log(e);
        if (e instanceof UserServiceError && e.code === "NOT_FOUND") {
            return res.status(400).json({ error: "Invalid credentials" })
        }
        else {
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
        console.log(err);
        return res.status(500).send({error : "Access token could not be generated"});
    }
}


export const UpdateUser = async(req: Request, res: Response): Promise<any> => {
    const userData = req.body as UserUpdateData;
    const validated = validateUpdateData(userData);

    if (!validated.isValid) {
        return res.status(400).json({error: validated.error})
    }

    try {
        const foundUser = await FindUserById(userData.id);
        if (foundUser) {
            const updatedUser = minimalResponse(await UpdateUserData(userData));
            return res.status(202).json({
                user: updatedUser
            })
        } else {
            throw new UserServiceError("User not found", "NOT_FOUND");
        }
    } catch (err) {
        if (err instanceof UserServiceError) {
            switch (err.code) {
                case "INVALID_DETAILS":
                    return res.status(409).json({ "error": err.message })
                case "NOT_FOUND":
                    return res.status(409).json({ "error": err.message })
                default:
                    return res.status(500).json({ "error": "Internal Server Error" })
            }
        } else {
            console.error("Unexpected error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}


export const DeleteUser = async(req: Request, res: Response): Promise<any> => {
    const {UserId} = req.body as DeleteData;

    if (!UserId) {
        return res.status(400).json({error: "User id is required"})
    }

    try {
        const foundUser = await FindUserById(UserId);       
        if (foundUser) {
            await DeleteUserData(UserId);
            return res.sendStatus(204);
        } else {
            throw new UserServiceError("User not found", "NOT_FOUND");
        }
    } catch (err) {
        if (err instanceof UserServiceError) {
            switch (err.code) {
                case "INVALID_DETAILS":
                    return res.status(409).json({ "error": err.message })
                case "NOT_FOUND":
                    return res.status(404).json({ "error": err.message })
                default:
                    return res.status(500).json({ "error": "Internal Server Error" })
            }
        } else {
            console.error("Unexpected error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}