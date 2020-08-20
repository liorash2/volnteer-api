const MongoService = require("./mongo/service.mongo.hobbies");



class HobbiesService {

    static async getAllHobbies() {

        let mongoservice = new MongoService();
        var response = mongoservice.GetAllHobbies();
        if(response instanceof Error)
        {
            throw response;
        }
        return response;

    }

}

module.exports = HobbiesService;