import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import * as userController from '../controllers/userController';

export function getRouter() {
    const router = Router();

    router.delete('/user', authMiddleware, userController.deleteUser);

    return router;
}