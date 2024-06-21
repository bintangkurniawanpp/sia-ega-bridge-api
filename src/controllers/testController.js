import ExternalApiService from '../services/testService.js';
import logger from "../application/logger.js";

class TestController {

    // Recursive function to find the parent group with AT_ID attribute
    static findParentGroupWithId(group) {
        if (!group) return null;
        const idAttribute = group.attributes.find(attr => attr.apiname === 'AT_ID');
        if (idAttribute) return group;
        return TestController.findParentGroupWithId(group.parent_group);
    }

    // Function to extract attributes from the group
    static extractGroupAttributes(group) {
    const nameAttribute = group.attributes.find(attr => attr.apiname === 'AT_NAME');
    const idAttribute = group.attributes.find(attr => attr.apiname === 'AT_ID');
    return {
        guid: group.guid,
        name: nameAttribute ? nameAttribute.value : null,
        id: idAttribute ? idAttribute.value : null
    };
    }

    static async testGetGroupChildren(req, res, next) {
        try {
          const { dbName } = req.query;
          const accessToken = req.umcToken;
          const groupID = '406d21e4-15e6-11ef-03f9-00505601464d'; // Provided groupID for testing
    
          const rawData = await ExternalApiService.getGroupChildren(dbName, groupID, accessToken);
    
          // Filter the data based on specific criteria
          const filteredData = rawData.items.filter(item =>
            item.type === 150 &&
            item.typename === "Diagram Peta Rencana" &&
            item.apiname === "MT_KPI_ALLOC_DGM"
          );
    
          // Find the target parent group
          const targetParentGroup = TestController.findParentGroupWithId(filteredData[0].parent_group);
          const jenisInstansi = targetParentGroup ? TestController.extractGroupAttributes(targetParentGroup.parent_group.parent_group) : null;
          const kategoriInstansi = targetParentGroup ? TestController.extractGroupAttributes(targetParentGroup.parent_group) : null;
          const namaInstansi = targetParentGroup ? TestController.extractGroupAttributes(targetParentGroup) : null;
    
          // Transform the filtered data to include only guid and name
          const items = filteredData.map(item => {
            const nameAttribute = item.attributes.find(attr => attr.apiname === 'AT_NAME');
            return {
              guid: item.guid,
              name: nameAttribute ? nameAttribute.value : null,
            };
          });
    
          const responseData = {
            status: rawData.status,
            request: rawData.request,
            data: {
              guid_nama_instansi: namaInstansi ? namaInstansi.guid : null,
              id_nomenklatur: targetParentGroup ? targetParentGroup.attributes.find(attr => attr.apiname === 'AT_ID').value : null,
              nama_instansi: namaInstansi ? namaInstansi.name : null,
              jenis_instansi: jenisInstansi ? jenisInstansi.name : null,
              kategori_instansi: kategoriInstansi ? kategoriInstansi.name : null,
              item_count: items.length,
              items: items
            }
          };
    
          res.json(responseData);
        } catch (error) {
          logger.error("Error in testGetGroupChildren: ", error);
          next(error);
        }
    }
}

export default TestController;
