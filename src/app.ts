import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import routes from './loaders/routes'
import logger from './loggers/logger'
import {connectDB} from './loaders/db'

(async () => {
    await connectDB()
})()

const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(bodyParser.json())
routes(app)

const PORT = process.env.PORT
const URL = process.env.URL
app.listen(PORT, () => {
    logger.info(`Server listening on http://${URL}:${PORT}`)
});

export default app