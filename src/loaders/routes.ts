import {Express} from 'express';
import swaggerUi from 'swagger-ui-express';
import AuthController from '../api/auth';
import SwaggerOptions from '../static/swaggerOptions.json';
import logger from '../loggers/logger';

export default (app: Express) => {
    logger.info('Loading routes...');

    app.use(AuthController);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerOptions));

    logger.info('Routes loaded!');
}
