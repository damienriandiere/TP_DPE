import { Router } from "express"
import * as geolocalisationControllers from "../controllers/geolocationController"
import { authMiddleware } from "../middlewares/authMiddleware"

export function getRouter() {
    const router = Router()

    router.get('/api/v1/geolocalisation/:dpe/:ges/:zipcode/:surface', authMiddleware, geolocalisationControllers.getGeolocalisation)

    return router
}