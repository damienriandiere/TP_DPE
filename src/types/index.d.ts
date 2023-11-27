import { Request } from 'express';
import { Document } from 'mongoose';

export interface User {
    name: string;
    email: string;
    password: string;
}  

export interface UserModel extends Document, User {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AuthenticatedRequest extends Request {
    req: import("mongoose").Document<unknown, {}, { email: string; name: string; password: string; }> & { email: string; name: string; password: string; } & { _id: import("mongoose").Types.ObjectId; };
    user?: User;
}