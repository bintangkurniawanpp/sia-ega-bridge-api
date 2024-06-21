import https from "https";
import axios from "axios";
import config from "../config/config.js";
import logger from "../application/logger.js";

// Axios Setup
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
})

// Config
const getConfig = () => {
  const currentConfig = config.development; // Or config[process.env.NODE_ENV] for environment-specific config
  return {
    umcUrl: currentConfig.umcUrl + "/v2/tokens",
    tenant: currentConfig.ARIStenant,
    username: currentConfig.ARISusername,
    password: currentConfig.ARISpassword,
  }
}

// Obtain UMC Token
async function getToken(url, params) {
  try {
    logger.info(`Requesting UMC token from ${url}`);
    const response = await axiosInstance.post(url, params);
    logger.info(`UMC token received successfully.`);
    return response.data;
  } catch (error) {
    logger.error("Error fetching UMC token:", error);
    throw error;
  }
}

export const getUmcToken = async () => {
  const { umcUrl, tenant, username, password } = getConfig();
  const params = new URLSearchParams({ tenant, name: username, password });
  return await getToken(umcUrl, params);
}


export async function revokeUmcToken(token) {
  const revokeUrl = `${config.umcUrl}/tokens/${token}`; // ARIS revocation endpoint
  try {
      logger.info(`Revoking UMC token: ${token}`);
      const response = await axiosInstance.delete(revokeUrl);
      
      if (response.status === 204) {  // 204 No Content indicates successful revocation
          logger.info("UMC token revoked successfully.");
      } else {
          logger.warn(`Unexpected response from UMC token revocation: ${response.status}`);
      }
  } catch (error) {
      logger.error("Error revoking UMC token:", error);
      // Consider error handling strategies (see below)
  }
}


