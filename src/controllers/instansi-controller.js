import { getAllInstansi } from '../services/instansi-service.js';
import logger from '../application/logger.js';

const getAllInstansiController = async (req, res, next) => {
  try {
    const token = req.umcToken;
    const dbName = req.dbName;
    const response = await getAllInstansi(token, dbName);

    if (response.status === "OK") {
      res.status(200).json(response);
    } 
    
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({
        status: "GENERAL_FAILURE",
        info: error.statusText || error.message,
      });
    } else {
      logger.error(`Controller error: ${error.message}`);
      res.status(500).json({
        status: "GENERAL_FAILURE",
        info: error.message,
      });
    }
  }
};

export { getAllInstansiController };