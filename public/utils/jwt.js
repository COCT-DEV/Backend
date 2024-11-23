"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class TokenService {
    constructor() {
        const accessSecret = process.env.TOKEN_SECRET;
        const refreshSecret = process.env.REFRESH_SECRET;
        if (!accessSecret || !refreshSecret) {
            throw new Error("Tokens could not be generated");
        }
        this.accessTokenSecret = accessSecret;
        this.refreshTokenSecret = refreshSecret;
    }
    /**
     *
     * @param user User payload {userId, fullName}
     * @returns
     */
    generateTokens(user) {
        const payload = {
            userId: user.userId,
            fullName: user.fullName,
            type: "access"
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, this.accessTokenSecret, { algorithm: 'HS256', expiresIn: '1800s' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.userId, type: "refresh" }, this.refreshTokenSecret, { expiresIn: '15m', algorithm: 'HS256' });
        return { accessToken, refreshToken };
    }
    refreshAccessToken(refreshToken) {
        try {
            const payload = jsonwebtoken_1.default.verify(refreshToken, this.refreshTokenSecret);
            if (payload.type != 'refresh') {
                throw new Error('Invalid token type');
            }
            return jsonwebtoken_1.default.sign(payload, this.accessTokenSecret, { algorithm: 'HS256' });
        }
        catch (err) {
            throw err;
        }
    }
    verifyAccessToken(accessToken) {
        try {
            const payload = jsonwebtoken_1.default.verify(accessToken, this.accessTokenSecret);
            if (payload.type != 'access') {
                throw new Error('Invalid token type');
            }
            return true;
        }
        catch (err) {
            throw err;
        }
    }
}
const tokenService = new TokenService();
exports.default = tokenService;
