// middleware/apikey-middleware.js

import config from '../config/config.js';
import logger from "../application/logger.js";

function checkApiKeyMiddleware(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query.apiKey;

  if (!apiKey) {
    logger.error("Missing API key.");
    return res.status(401).end("Unauthorized"); // Use end() for a more concise error response
  }

  logger.info("Checking API key...");

  if (apiKey === config.development.apiKeyDev) {
    req.env = "development";
    req.dbName = config.development.absDatabaseDev;
    logger.info("Using development database: " + req.dbName);
  } else if (apiKey === config.production.apiKeyProd) {
    req.env = "production";
    req.dbName = config.production.absDatabaseProd;
    logger.info("Using production database: " + req.dbName);
  } else {
    logger.error("Invalid API key.");
    return res.status(401).end("Unauthorized"); // Use end() for a cleaner error response
  }

  next();
}

export default checkApiKeyMiddleware;