import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import UserModel from '../models/userModel';
import { createTokens, hashPassword, comparePassword } from '../utils/authUtils';
import { getUserProfile } from './userService';


export async function register(name: string, email: string, password: string) {
    const findUser = await UserModel.findOne({ email: email });
    if (findUser) {
        logger.error('User already exists !')
        throw new Error('User already exists !');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new UserModel({
        name: name,
        email: email,
        password: hashedPassword,
        savedSearches: []
    });

    await newUser.save();

    const userProfile = await getUserProfile(newUser._id);

    return { ...createTokens(userProfile), userProfile };
}

export function refresh(refreshToken: string) {
    const secretKey = process.env.REFRESH_SECRET_KEY;
    const user = jwt.verify(refreshToken, secretKey) as typeof UserModel;

    return createTokens(user);
}

export async function login(email: string, password: string) {
    const findUser = await UserModel.findOne({ email: email });

    if (!findUser) {
        logger.error('User not found !')
        throw new Error('User not found !');
    }

    const isMatch = await comparePassword(password, findUser.password as string);

    if (!isMatch) {
        logger.error('Incorrect password !')
        throw new Error('Incorrect password !');
    }

    const userProfile = await getUserProfile(findUser._id);

    return { ...createTokens(userProfile), userProfile };
}