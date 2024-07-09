import config from "../config/config.js";
import logger from "../application/logger.js";
import { getAxiosInstance } from "../utils/common-utils.js";
import { ResponseError } from "../error/response-error.js"; 

const axiosInstance = getAxiosInstance();

// Obtain Database Info
export const getDatabaseInfo = async (accessToken) => {
  const { absUrl } = config[process.env.NODE_ENV] || config.development;
  const url = `${absUrl}/databases`;
  const params = {
    attributes: "all",
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
  };

  try {
    logger.info(`Requesting database info from ${url} with params ${JSON.stringify(params)} and headers ${JSON.stringify(headers)}`);
    const response = await axiosInstance.get(url, { params, headers });
    logger.info(`Successfully received response from ${url}`);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching database info: ${error.message}`);
    throw new ResponseError(500, "Internal Server Error: Error fetching database information"); // Throw a ResponseError with details
  }
};

// Obtain Main Group GUID from database info
export const getMainGroupGUID = async (accessToken, dbName) => {
  try {
    logger.info(`Fetching main group GUID for database ${dbName}`);
    const databases = await getDatabaseInfo(accessToken);
    const database = databases.items.find((db) => db.name === dbName);
    return database ? database.maingroup_guid : null;
  } catch (error) {
    logger.error(`Error fetching main group GUID: ${error.message}`);
    throw new ResponseError(500, "Internal Server Error: Error fetching main group GUID"); // Throw a ResponseError with details
  }
};
