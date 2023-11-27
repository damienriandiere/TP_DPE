import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import * as process from 'process';
import { AuthenticatedRequest, User } from '../types';
import logger from '../loggers/logger';
import UserModelMongoose from '../models/userModel';

const accessExpire = process.env.ACCESS_TOKEN_EXPIRE;
const refreshExpire = process.env.REFRESH_TOKEN_EXPIRE;

const getSecrets = (): { accessSecret: string, refreshSecret: string } => {
    logger.info('getSecrets')
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessSecret || !refreshSecret) {
        const errStr = !accessSecret ? "ACCESS_SECRET is not defined ! " : "";
        logger.error('Tokens secret is not defined !');
        throw new Error(errStr + (!refreshSecret ? "REFRESH_SECRET is not defined !" : ""));
    }
    logger.info('Tokens secret is defined !')
    return {
        accessSecret,
        refreshSecret
    };
}

export const createTokens = (user: User) => {
    logger.info('createTokens')
    const { accessSecret, refreshSecret } = getSecrets();

    const accessToken = jwt.sign({ email: user.email}, accessSecret, { expiresIn: accessExpire });
    const refreshToken = jwt.sign({ email: user.email}, refreshSecret, { expiresIn: refreshExpire });
    logger.info('Tokens created.')

    return { accessToken, refreshToken, expiresIn: accessExpire, refreshExpiresIn: refreshExpire };
}

export const checkRefresh = (refreshToken: string) => {
    logger.info('checkRefresh')
    const { refreshSecret } = getSecrets();

    try {
        const jwtPayload = jwt.verify(refreshToken, refreshSecret);
        if (typeof jwtPayload == "string") {
            logger.warn('Invalide JWT token.')
            return { success: false, message: 'Invalid JWT token.' };
        }
        logger.info('JWT token is valid.')
        return { success: true, payload: jwtPayload };
    } catch (error: any) {
        logger.error(error.message)
        return { success: false, message: error.message }
    }
}

export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    logger.info('isAuthenticated')
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader){
        logger.error('No Authorization header found !')
        return res.status(401).json({ success: false, message: "No 'Authorization' header found !" });
    } 
    const authToken = bearerHeader.split(" ")[1];
    if (!authToken){
        logger.error('No token found in Authorization header !')
        return res.status(401).json({ success: false, message: "No token found in 'Authorization' header !" });
    }

    const { accessSecret } = getSecrets();

    jwt.verify(authToken, accessSecret, async (err: any, jwtPayload: any) => {
        if (err || !jwtPayload) {
            logger.error(err ?? "Payload invalid")
            return res.status(401).json({ success: false, message: err ?? "Payload invalid" });
        }

        if (typeof jwtPayload == "string") {
            logger.error('JWT token invalid')
            return res.status(401).json({ success: false, message: "JWT token invalid" });
        }

        const user = await UserModelMongoose.findOne({ email: jwtPayload.email }).select('-password');

        if (!user) {
            logger.error('The user no longer exists!')
            return res.status(404).json({ success: false, message: 'The user no longer exists!' });
        }

        req.user = user;

        next();
    });
}