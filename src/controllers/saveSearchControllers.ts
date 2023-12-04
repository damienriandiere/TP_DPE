import {Response, NextFunction} from 'express'
import { AuthenticatedRequest } from '../types'
import * as saveSearchServices from '../services/saveSearchServices'

export async function getSearches(req : AuthenticatedRequest, res : Response, next : NextFunction) {
    try {
        const {page} = req.params;
        const connectedUser = req.user;

        const result = await saveSearchServices.getSearches(connectedUser, parseInt(page));
        res.status(200).json({ success: true, result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        next(error);
    }
}

export async function relaunchSearch(req : AuthenticatedRequest, res : Response, next : NextFunction) {
    try {
        const {id} = req.params;
        const connectedUser = req.user;

        const result = await saveSearchServices.relaunchSearch(connectedUser, id);
        res.status(200).json({ success: true, result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        next(error);
    }
}

export async function deleteSearch(req : AuthenticatedRequest, res : Response, next : NextFunction) {
    try {
        const {id} = req.params;
        const connectedUser = req.user;

        const result = await saveSearchServices.deleteSearch(connectedUser, id);
        res.status(200).json({ success: true, result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        next(error);
    }
}