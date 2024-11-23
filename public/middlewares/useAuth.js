"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt_1 = __importDefault(require("../utils/jwt"));
const AUTHORIZATION = Boolean(process.env.AUTHORIZATION) || false;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        res.status(401).json({ error: "No token, authorization denied" });
        return;
    }
    try {
        console.log(token);
        if (jwt_1.default.verifyAccessToken(token)) {
            process.env.AUTHORIZATION = "false";
            return next();
        }
        res.status(401).json({ error: "Invalid token, authorization denied" });
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ error: "Invalid token, authorization denied" });
        return;
    }
};
exports.authenticateToken = authenticateToken;
