import { Router } from "express"
import * as saveSearchControllers from "../controllers/saveSearchController"
import { authMiddleware } from "../middlewares/authMiddleware"

export function getRouter() {
    const router = Router()

    router.get('/api/v1/saveSearches/:page', authMiddleware, saveSearchControllers.getSearches)
    router.get('/api/v1/relaunchSearch/:id', authMiddleware, saveSearchControllers.relaunchSearch)
    router.delete('/api/v1/saveSearch/:id', authMiddleware, saveSearchControllers.deleteSearch)

    return router
}