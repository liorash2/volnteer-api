const MongoService = require("./services.mongo");



class RegionService {

    static async getAllRegions() {

        let mongoservice = new MongoService();
        var response = mongoservice.GetAllRegions();
        if(response instanceof Error)
        {
            throw response;
        }
        return response;

    }

}

module.exports = RegionService;