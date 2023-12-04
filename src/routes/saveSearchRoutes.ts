import { Router } from "express";
import * as saveSearchControllers from "../controllers/saveSearchControllers";
import { authMiddleware } from "../middleware/authMiddleware";

export function getRouter(){
    const router = Router();

    router.get('/saveSearches/:page', authMiddleware, saveSearchControllers.getSearches);
    router.get('/relaunchSearch/:id', authMiddleware, saveSearchControllers.relaunchSearch);
    router.delete('/saveSearch/:id', authMiddleware, saveSearchControllers.deleteSearch);

    return router;
}