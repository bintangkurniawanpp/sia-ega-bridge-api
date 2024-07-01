// middleware/token-middleware.js

import { getUmcToken, revokeUmcToken } from '../services/token-service.js';
import logger from "../application/logger.js";

// Declare variables to store token and expiration time
let umcToken = null;
let tokenExpirationTime = null;

async function tokenMiddleware(req, res, next) {
  // Get the current time
  const currentTime = Date.now();

  // Check if a valid token already exists
  if (tokenExpirationTime && tokenExpirationTime > currentTime) {
    const timeRemaining = tokenExpirationTime - currentTime;
    logger.info(`Reusing existing UMC token. Expires in ${timeRemaining / 1000} seconds.`);
    req.umcToken = umcToken;
    return next();
  }

  try {
    logger.info("Fetching new UMC token.");
    const tokenData = await getUmcToken();
    umcToken = tokenData.token;

    // Set initial and maximum session durations
    const initialSessionDuration = 60 * 60 * 1000; // 60 minutes in milliseconds
    const maxSessionDuration = 7200 * 60 * 1000; // 7200 minutes in milliseconds

    // Calculate expiration time with buffer for potential delays
    tokenExpirationTime = currentTime + initialSessionDuration - 5000; // Subtract a buffer of 5 seconds

    logger.info(`New UMC token obtained. Initial expiration at ${new Date(tokenExpirationTime).toISOString()}`);

    // Schedule token revocation before maximum session duration
    setTimeout(async () => {
      try {
        await revokeUmcToken(umcToken);
        logger.info("UMC token revoked.");
        umcToken = null;
        tokenExpirationTime = null;
      } catch (error) {
        logger.error("Error revoking UMC token:", error);
      }
    }, maxSessionDuration - initialSessionDuration);

    req.umcToken = umcToken;
    next();
  } catch (error) {
    logger.error("Error obtaining UMC token:", error);
    res.status(500).send("Internal Server Error");
  }
}

export default tokenMiddleware;
