import mongoose from 'mongoose';
import logger from '../loggers/logger'

const connectDB = async () => {
    try {
        logger.info('MongoDB connected...');
        mongoose.connect(process.env.MONGO_URL, {});
    } catch (err) {
        logger.error(err.message);
        process.exit(1);
    }
    logger.info('Connected to MongoDB!')
}

export { connectDB };