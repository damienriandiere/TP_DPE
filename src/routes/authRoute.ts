import { Router } from 'express';
import * as authController from '../controllers/authController';


export function getRouter() {
    const router = Router();

    router.post('/api/v1/register', authController.register);
    router.post('/api/v1/login', authController.login);
    router.post('/api/v1/refresh', authController.refresh);

    return router;
}
