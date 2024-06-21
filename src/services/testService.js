import axios from 'axios';
import config from '../config/config.js';
import logger from "../application/logger.js";

class ExternalApiService {
  async getGroupChildren(dbName, groupID, accessToken) {
    const encodedDbName = encodeURIComponent(dbName);
    const url = `${config.development.absUrl}/groups/${encodedDbName}/${groupID}/children`;
    const params = {
      orderby: 'name',
      attributes: 'all',
      withobjects: 'false',
      withmodels: 'true',
      withpath: 'true',
      withparentgroup: 'true',
    };
    const headers = {
      'Authorization': `Bearer ${accessToken}` // Pass the token in the Authorization header
    };

    try {
      logger.info(`Requesting group children from ${url} with params ${JSON.stringify(params)} and headers ${JSON.stringify(headers)}`);
      const response = await axios.get(url, { params, headers });
      logger.info(`Successfully received response from ${url}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching group children: ${error.message}`);
      throw error;
    }
  }
}

export default new ExternalApiService();
