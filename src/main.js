import web from './application/web.js';
import logger from './application/logger.js';

// Start the server
const PORT = process.env.PORT || 3000;
web.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
