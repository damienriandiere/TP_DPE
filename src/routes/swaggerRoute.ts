import { Express } from 'express'
import swaggerUI from 'swagger-ui-express'
import yaml from 'yaml'
import fs from 'fs'
import path from 'path'
import logger from '../utils/logger'

export default (app: Express) => {
    const file = fs.readFileSync(path.resolve(__dirname, "../models/swagger.yaml"), 'utf-8')
    const swaggerDocuement = yaml.parse(file)

    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocuement))

    logger.log("info", "Swagger loaded")
}