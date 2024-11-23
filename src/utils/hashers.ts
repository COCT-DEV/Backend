import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10;

/**
 * 
 * @param password password of user
 * @returns a hashedPassword
 */
export const hashPassword = async (password:string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword
    }
    catch (err) {
        throw err
    }
}

/**
 * 
 * @param password password from request
 * @param hashedPassword password from database
 * @returns compares the passwords and returns a boolean
 */
export const comparePassword = async (password:string, hashedPassword:string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword)
    }
    catch (err) {
        throw err;
    }
}