import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../types'
import logger from '../utils/logger'
import * as geolocalisationServices from '../services/geolocationService'
import { saveSearch } from '../services/saveSearchService'

export async function getGeolocalisation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const { dpe, ges, zipcode, surface } = req.params

        const connectedUser = req.user

        const result = await geolocalisationServices.getGeolocalisation(dpe, ges, parseInt(zipcode), parseInt(surface))

        await saveSearch(connectedUser, dpe, ges, parseInt(zipcode), parseInt(surface), result)
        logger.info(`Search saved`)

        res.status(200).json({ success: true, result })
    } catch (error: any) {
        logger.error(error.message)
        res.status(400).json({ success: false, message: error.message })
        next(error)
    }
}