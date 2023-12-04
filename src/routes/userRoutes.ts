import {Router} from 'express';
import { authMiddleware } from '../middlewares/authMiddlewares';
import * as userController from '../controllers/userControllers';

export function getRouter(){
    const router = Router();

    router.delete('/user', authMiddleware, userController.deleteUser);

    return router;
}