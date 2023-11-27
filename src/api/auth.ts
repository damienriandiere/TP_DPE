import { Router } from 'express';
import { checkRefresh, createTokens, isAuthenticated } from '../services/auth';
import { AuthenticatedRequest, UserModel } from '../types';
import User from '../models/userModel';
import logger from '../loggers/logger';
const router = Router();

router.get('/me', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    logger.info('GET /me')
    try {
        const userId = (req.user as any).userId;
        const user: UserModel | null = await User.findById(userId);

        if (!user) {
            logger.error('User not found.')
            return res.status(404).json({ message: 'User not found.' });
        }

        logger.info('User informations retrieved : ', user.name, user.email, '.')
        res.status(200).json({
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        logger.error('Error retrieving user informations : ', error);
        res.status(500).json({ message: 'Error retrieving user informations.' });
    }
})

router.post('/register', async (req, res) => {
    logger.info('POST /register')
    const { name, email, password } = req.body;

    try {
        const existingUser: UserModel | null = await User.findOne({ email });

        if (existingUser) {
            logger.error('This email is already in use.')
            return res.status(400).json({ message: 'This email is already in use.' });
        }

        const newUser = new User({ name, email, password });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error('Error while creating the user :', error);
        res.status(500).json({ message: 'Error while creating the user.' });
    }
});

router.post('/login', async (req, res) => {
    logger.info('POST /login')
    const { email, password } = req.body;

    try {
        const user: UserModel | null = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            logger.error('Invalid identifiers.')
            return res.status(401).json({ message: 'Invalid identifiers.' });
        }

        const token = createTokens(user);
        logger.info('User logged in successfully.')
        return res.status(200).json({ token });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error during the connexion.' });
    }
});

router.post('/refresh', async (req, res) => {
    logger.info('POST /refresh')
    const { refreshToken } = req.body;

    const isValid = checkRefresh(refreshToken);

    if (!isValid.success || !isValid.payload) {
        logger.error('Invalid refresh token.')
        return res.status(401).json(isValid);
    }

    const email = isValid.payload.email;
    const user: UserModel | null = await User.findOne({ email });

    if (!user){
        logger.error('The user no longer exists!')
        return res.status(404).json({ success: false, message: 'The user no longer exists!' });
    } 

    const token = createTokens(user);
    logger.info('Tokens refreshed.')
    res.json({ token })
});

export default router;