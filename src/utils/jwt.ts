import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

interface UserPayload {
    userId: string | undefined,
    fullName: string | undefined,
}
interface Tokens {
    accessToken: string,
    refreshToken: string,
}

class TokenService {
    private readonly accessTokenSecret: string | undefined;
    private readonly refreshTokenSecret: string | undefined;

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
    generateTokens(user: UserPayload): Tokens {
        const payload = {
            userId: user.userId,
            fullName: user.fullName,
            type: "access"
        }
        const accessToken = jwt.sign(payload, this.accessTokenSecret as string, { algorithm: 'HS256', expiresIn: '1800s' });
        const refreshToken = jwt.sign({userId:user.userId, type:"refresh"}, this.refreshTokenSecret as string, {expiresIn: '15m', algorithm:'HS256'})
        return {accessToken, refreshToken}
    }

    refreshAccessToken(refreshToken:string): string {
        try {
            const payload = jwt.verify(refreshToken, this.refreshTokenSecret as string) as JwtPayload;
            if (payload.type != 'refresh') {
                throw new Error('Invalid token type');
            }
            return jwt.sign(payload, this.accessTokenSecret as string, { algorithm: 'HS256'})
        } catch (err) {
            throw err;
        }
    }
    verifyAccessToken(accessToken: string): boolean {
        try {
            const payload = jwt.verify(accessToken, this.accessTokenSecret as string) as JwtPayload;
            if (payload.type != 'access') {
                throw new Error('Invalid token type');
            }
            return true
        } catch (err) {
            throw err;
        }
    }
}
const tokenService = new TokenService();
export default tokenService;