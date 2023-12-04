import { Router } from 'express';
import * as authController from '../controllers/authController';


export function getRouter() {
    const router = Router();

    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.post('/refresh', authController.refresh);

    return router;
}
