import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import logger from './utils/logger'
import mongoose from 'mongoose'
import * as authRoutes from './routes/authRoutes'
import * as userRoutes from './routes/userRoutes'

dotenv.config()

mongoose.connect(process.env.DB_URL, {})
    .then(() => logger.info('Connected to MongoDB!'))
    .catch((err) => logger.error(err.message));

const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(authRoutes.getRouter());
app.use(userRoutes.getRouter());

const PORT = process.env.PORT
const URL = process.env.URL

app.listen(PORT, () => {
    logger.info(`Server listening on http://${URL}:${PORT}`)
});