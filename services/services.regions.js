const MongoService = require("./mongo/service.mongo.regions");
class RegionService {

    static async getAllRegions() {
        let mongoservice = new MongoService();
        var response = mongoservice.GetAllRegions();
        if (response instanceof Error) {
            throw response;
        }
        return response;
    }
}

module.exports = RegionService;