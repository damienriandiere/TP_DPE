import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import logger from './utils/logger'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import * as authRoutes from './routes/authRoute'
import * as userRoutes from './routes/userRoute'
import * as geolocalisationRoutes from './routes/geolocationRoute'
import * as saveSearchRoute from './routes/saveSearchRoute'
import swaggerLoader from './routes/swaggerRoute'

dotenv.config()

mongoose.connect(process.env.DB_URL, {})
    .then(() => logger.info('Connected to MongoDB!'))
    .catch((err) => logger.error(err.message))

const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(bodyParser.json())
app.use(authRoutes.getRouter())
app.use(userRoutes.getRouter())
app.use(geolocalisationRoutes.getRouter())
app.use(saveSearchRoute.getRouter())
swaggerLoader(app)

const PORT = process.env.PORT
const URL = process.env.URL

app.listen(parseInt(PORT), URL, () => {
    logger.info(`Server listening on http://${URL}:${PORT}`)
});

export default app