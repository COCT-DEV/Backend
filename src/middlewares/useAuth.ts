import { NextFunction, Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

const SECRET_KEY: Secret = String(process.env.SECRET_KEY);
const AUTHORIZATION: boolean = Boolean(process.env.AUTHORIZATION) || false

//TODO: Clean up later to use TokenService
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = <string>req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: "No token, authorization denied" });

    try {
        jwt.verify(token, SECRET_KEY);
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid token, authorization denied" });
    }

}