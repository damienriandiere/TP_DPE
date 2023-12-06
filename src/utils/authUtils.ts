import bcrypt from 'bcrypt'
import logger from './logger'
import jwt from 'jsonwebtoken'


export function createTokens(user: any) {
    const accessKey = process.env.ACCESS_KEY_SECRET
    const refreshKey = process.env.REFRESH_KEY_SECRET

    const accessToken = jwt.sign(user, accessKey, { expiresIn: '1h' })
    const refreshToken = jwt.sign(user, refreshKey, { expiresIn: '2h' })

    return { accessToken, refreshToken, expiresIn: '1h' }
}

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    logger.info("Salt generated")

    const hashedPassword = await bcrypt.hash(password, salt)
    logger.info("Password hashed")

    return hashedPassword;
}

export async function comparePassword(candidatePassword: string, userPassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, userPassword)

    return isMatch;
}

