// services/instansi-service.js

import https from "https";
import axios from "axios";
import logger from "../application/logger.js";
import { getMainGroupGUID } from "./arisdb-service.js";
import config from "../config/config.js";
import { ResponseError } from "../error/response-error.js";

// Axios Setup
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

// Get Group Children
async function getGroupChildren(dbName, groupID, accessToken) {
  const { absUrl } = config[process.env.NODE_ENV] || config.development;
  const url = `${absUrl}/groups/${dbName}/${groupID}/children`;
  const params = {
    umcsession: accessToken,
    orderby: "name",
    attributes: "all",
    withobjects: "false",
    withparentgroup: "true",
  };

  const headers = {
    Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
  };

  try {
    logger.info(`Getting children of group ${groupID} from database ${dbName}`);
    const response = await axiosInstance.get(url, { params, headers });
    return response.data;
  } catch (error) {
    if (error.response) {
      logger.error(`Error getting children: ${error.response.status} ${error.response.statusText}`);
      throw new ResponseError(error.response.status, error.response.statusText);
    } else {
      logger.error(`Error getting children: ${error.message}`);
      throw error;
    }
  }
}

// Get nested groups up to a certain depth recursively
const getNestedGroups = async (dbName, groupID, accessToken, currentDepth, maxDepth) => {
  if (currentDepth > maxDepth) {
    return [];
  }

  const children = await getGroupChildren(dbName, groupID, accessToken);
  const nestedGroups = await Promise.all(
    children.items.map(async (item) => {
      if (item.kind === "GROUP") {
        const nested = await getNestedGroups(dbName, item.guid, accessToken, currentDepth + 1, maxDepth);
        const idAttribute = item.attributes.find(attr => attr.apiname === "AT_ID");
        return {
          guid: item.guid,
          name: item.attributes.find((attr) => attr.apiname === "AT_NAME").value,
          id_kl: idAttribute ? idAttribute.value : null,
          items: nested,
        };
      } else {
        return null;
      }
    })
  );

  return nestedGroups.filter((group) => group !== null);
};

// Get all instansi
export const getAllInstansi = async (accessToken, dbName) => {
  const mainGroupGUID = await getMainGroupGUID(accessToken, dbName);
  if (!mainGroupGUID) {
    throw new ResponseError(404, `Main group GUID not found for database ${dbName}`);
  }

  try {
    logger.info(`Getting instansi from main group ${mainGroupGUID}`);
    const topLevelGroups = await getGroupChildren(dbName, mainGroupGUID, accessToken);
    logger.info(`Successfully received top level instansi from main group ${mainGroupGUID}`);
    
    logger.info(`Getting nested instansi`);
    const filteredGroups = topLevelGroups.items.filter(group => {
      const groupName = group.attributes.find(attr => attr.apiname === 'AT_NAME').value;
      return groupName.includes('Arsitektur Instansi Pusat') || groupName.includes('Arsitektur Pemerintah Daerah');
    });
  
    const results = await Promise.all(filteredGroups.map(async (group) => {
      const nestedGroups = await getNestedGroups(dbName, group.guid, accessToken, 1, 2);
      return {
          guid: group.guid,
          name: group.attributes.find(attr => attr.apiname === 'AT_NAME').value,
          items: nestedGroups
      }
    }));
    logger.info(`Successfully received nested instansi`);

    return {
      status: "OK",
      request: "getAllInstansi",
      data: {
        instansi: results
      }
    };
  } catch (error) {
    if (error instanceof ResponseError) {
      logger.error(`Error fetching instansi: ${error.message}`);
      throw error;
    } else {
      logger.error(`Error fetching instansi: ${error.message}`);
      throw new ResponseError(500, error.message);
    }
  }
};
