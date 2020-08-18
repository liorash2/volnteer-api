const MongoService = require("./services.mongo");



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