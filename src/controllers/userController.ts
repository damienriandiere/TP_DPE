import { Response, NextFunction } from 'express'
import * as userServices from '../services/userService'
import { AuthenticatedRequest } from '../types'

export async function deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { id } = req.user

        const result = await userServices.deleteUser(id)
        res.status(200).json({ success: true, result })

    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message })
        next(error)
    }
}