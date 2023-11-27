import * as fs from 'fs';
const winston = require('winston');
import 'dotenv/config'

const filename = process.env.LOG_FILE;

if (fs.existsSync(filename)) {
  fs.writeFileSync(filename, ''); // clear log file
}

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({ filename : filename })
];

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: transports
});

export default logger;