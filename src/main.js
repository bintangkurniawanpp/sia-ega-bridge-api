import web from './application/web.js';
import logger from './application/logger.js';
import dotenv from 'dotenv';
dotenv.config();


// Start the server
const PORT = 3000;
web.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
