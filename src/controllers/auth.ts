import { Request, Response } from "express"
import { createUser, UserServiceError } from "../services/useServices";
import { minimalResponse } from "../models/userResponses";
import { UserRegistrationData } from "../types/userTypes";
import { validateRegistrationData } from "../utils/userUtils/validate";
import { error } from "console";



export const RegisterUser = async (req: Request, res: Response): Promise<any> => {
    const reqData = req.body as UserRegistrationData;

    const validation = validateRegistrationData(reqData);
    if (!validation.isValid) {
        return res.status(400).json({
            "error": validation.error,
        })
    } 

    try {
        const {confirm_password, ...UserData} = reqData;
        const newUser = await createUser(UserData);


        if (newUser) {
            const userData = minimalResponse(newUser)
            return res.status(200).json(
                {
                    "status": "ok",
                    "user": userData
                }
            )
        }
    } 
    catch (e) {
        if (e instanceof UserServiceError) {
            switch (e.code) {
                case "DUPLICATE_EMAIL": 
                return res.status(409).json({"error": e.message})
                default: 
                return res.status(500).json({"error": "Internal Server Error"})
            }
        }
    }
}