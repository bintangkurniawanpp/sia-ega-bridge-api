import winston, { format } from 'winston';
import 'winston-daily-rotate-file';
import { fileURLToPath } from 'url';  // Import this
import path from 'path';

const { combine, timestamp, label, printf } = format;

// Define a custom log format
const logFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp} [${label}] ${level}: ${message} ${stack ? '\n' + stack : ''}`;
});

// Get directory name of the current module file using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    label({ label: 'MAIN' }),
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    // Add daily log rotation to the project's logs directory
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '..', '..', 'logs', 'application-%DATE%.log'), // Use __dirname
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
  // Handle exceptions gracefully
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(__dirname, '..', '..', 'logs', 'exceptions.log') })
  ],
  // Handle uncaught rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(__dirname, '..', '..', 'logs', 'rejections.log') })
  ],
});

export default logger;