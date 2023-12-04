import bcrypt from 'bcrypt';
import logger from './logger';
import jwt from 'jsonwebtoken';

const accessExpire = process.env.ACCESS_TOKEN_EXPIRE;
const refreshExpire = process.env.REFRESH_TOKEN_EXPIRE;

export function createTokens(user: any) {
    const accessKey = process.env.ACCESS_KEY_SECRET
    const refreshKey = process.env.REFRESH_KEY_SECRET

    const accessToken = jwt.sign(user, accessKey, { expiresIn: accessExpire });
    const refreshToken = jwt.sign(user, refreshKey, { expiresIn: refreshExpire });

    return { accessToken, refreshToken, expiresIn: accessExpire };
}

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

export async function comparePassword(candidatePassword: string, userPassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, userPassword);

    return isMatch;
}

