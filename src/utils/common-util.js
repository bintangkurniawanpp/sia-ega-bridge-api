import axios from "axios";
import https from "https";
import config from "../config/config.js";
import logger from "../application/logger.js";
import { ResponseError } from "../error/response-error.js";

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

export const getAxiosInstance = () => axiosInstance;

// Get Group Children
export const getGroupChildren = async (dbName, groupID, accessToken) => {
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
export const getNestedGroups = async (dbName, groupID, accessToken, currentDepth, maxDepth) => {
  if (currentDepth > maxDepth) {
    return [];
  }

  const children = await getGroupChildren(dbName, groupID, accessToken);
  const nestedGroups = await Promise.all(
    children.items.map(async (item) => {
      if (item.kind === "GROUP") {
        const nested = await getNestedGroups(dbName, item.guid, accessToken, currentDepth + 1, maxDepth);
        const idAttribute = item.attributes.find(attr => attr.apiname === "AT_ID");
        const group = {
          guid: item.guid,
          name: item.attributes.find((attr) => attr.apiname === "AT_NAME").value,
          id_kl: idAttribute ? idAttribute.value : null,
        };
        if (nested.length > 0) {
          group.instansi = nested;
        }
        return group;
      } else {
        return null;
      }
    })
  );

  return nestedGroups.filter((group) => group !== null);
};
