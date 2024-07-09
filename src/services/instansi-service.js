import logger from "../application/logger.js";
import { getMainGroupGUID } from "./arisdb-service.js";
import { getGroupChildren, getNestedGroups } from "../utils/common-utils.js";
import { ResponseError } from "../error/response-error.js";

const transformAttributes = (attributes) => {
  const transformed = {};
  attributes.forEach(attr => {
    if (attr.apiname === "AT_ID") {
      transformed.id_kl = attr.value;
    } else if (attr.apiname === "AT_NAME") {
      transformed.name = attr.value;
    }
  });
  return transformed;
};

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
      const transformedNestedGroups = nestedGroups.map(item => {
        const transformedItem = transformAttributes(item.attributes);
        transformedItem.guid = item.guid;
        if (item.items && item.items.length > 0) {
          transformedItem.instansi = item.items.map(inst => {
            const transformedInst = transformAttributes(inst.attributes);
            transformedInst.guid = inst.guid;
            return transformedInst;
          });
        }
        return transformedItem;
      });
      const transformedGroup = transformAttributes(group.attributes);
      transformedGroup.guid = group.guid;
      transformedGroup.kategori_instansi = transformedNestedGroups;
      return transformedGroup;
    }));
    logger.info(`Successfully received nested instansi`);

    return {
      status: "OK",
      request: "getAllInstansi",
      data: {
        jenis_instansi: results
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
