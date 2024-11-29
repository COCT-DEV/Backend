import { NextFunction, Request, Response } from "express";
import tokenService from "../utils/jwt";
import { access } from "fs";

const AUTHORIZATION: boolean = Boolean(process.env.AUTHORIZATION) || false
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = <string>req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if (token == null) 
        {
            res.status(401).json({ error: "No token, authorization denied" });
            return;
        }

    try {
        if (tokenService.verifyAccessToken(token)) {
            process.env.AUTHORIZATION = "false";
            return next();
        }
        res.status(401).json({ error: "Invalid token, authorization denied" });
       
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "Invalid token, authorization denied" });
        return;
    }

}