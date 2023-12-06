import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest, UserAccount } from '../types'
import logger from '../utils/logger';

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    let token = req.headers.authorization;
    const accessKey = process.env.ACCESS_KEY_SECRET;

    if (!token) {
        logger.error('Token not found')
        return res.status(401).json({ message: 'Token not found' })
    }

    token = token.split(' ')[1];

    jwt.verify(token, accessKey as string, async (err, user) => {
        if (err) {
            logger.error('Invalid token' + err.message)
            return res.status(403).json({ message: 'Invalid token' + err.message })
        }

        req.user = user as UserAccount;

        next()
    });
}