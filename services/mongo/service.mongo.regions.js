const MongoService = require("../services.mongo");

class MongoRegionService extends MongoService{
    static regionsCollection = "regions";
    async GetAllRegions() {
        try {

            await this.init();
            let collection = await this.db.collection(MongoRegionService.regionsCollection);
            return await collection.find({}).toArray();
        } catch (e) {
            return new Error(e.message);
        }
        finally {
            await this.destroy();
        }
    }
}
module.exports  = MongoRegionService;