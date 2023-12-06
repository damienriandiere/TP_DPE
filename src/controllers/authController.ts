import { Request, Response } from 'express'
import * as authService from '../services/authService'
import logger from '../utils/logger'

export async function register(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body
        logger.info('New user creation... : ' + name + ' ' + email)
        const newUser = await authService.register(name, email, password)
        logger.info('New user created !')
        res.status(201).json({ success: true, newUser })

    } catch (error: any) {
        logger.error(error.message)
        res.status(400).json({ success: false, message: error.message })
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body

        const tokens = await authService.login(email, password)
        logger.info('User logged in !')
        res.status(200).json({ success: true, tokens })

    } catch (error: any) {
        logger.error(error.message)
        res.status(400).json({ success: false, message: error.message })
    }
}

export async function refresh(req: Request, res: Response) {
    try {
        const { refreshToken } = req.body

        const tokens = authService.refresh(refreshToken)
        logger.info('Tokens refreshed !')
        res.status(200).json({ success: true, tokens })

    } catch (error: any) {
        logger.error(error.message)
        res.status(400).json({ success: false, message: error.message })
    }
}