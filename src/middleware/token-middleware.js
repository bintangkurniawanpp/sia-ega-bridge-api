import { getUmcToken, revokeUmcToken } from '../services/token-service.js';
import logger from "../application/logger.js";

// Declare variables to store token and expiration time
let umcToken = null;
let tokenExpirationTime = null;

async function tokenMiddleware(req, res, next) {
  // Get the current time
  const currentTime = Date.now();

  if (tokenExpirationTime) {
    const timeRemaining = tokenExpirationTime - currentTime;

    if (timeRemaining > 0) {
      logger.info(`Reusing existing UMC token. Expires in ${timeRemaining / 1000} seconds.`);
      req.umcToken = umcToken;
      return next();
    }
  }

  try {
    logger.info("Fetching new UMC token.");
    const tokenData = await getUmcToken();
    umcToken = tokenData.token;
    
    const initialSessionDuration = 60 * 60 * 1000; // 60 minutes in milliseconds
    const maxSessionDuration = 7200 * 60 * 1000; // 7200 minutes in milliseconds

    tokenExpirationTime = currentTime + initialSessionDuration;

    logger.info(`New UMC token obtained. Initial expiration at ${new Date(tokenExpirationTime).toISOString()}`);

    // Schedule token revocation just before the maximum session duration
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