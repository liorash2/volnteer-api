const MongoService = require("../services.mongo");

class MongoHobbiesService extends MongoService {
    static hobbiesCollection = "Voluntary_types";
    async GetAllHobbies() {
        try {
            await this.init();
            let collection = await this.db.collection(MongoHobbiesService.hobbiesCollection);
            return await collection.find({}).toArray();
        } catch (e) {
            return new Error(e.message);
        }
        finally {
            await this.destroy();
        }
    }
}
module.exports = MongoHobbiesService;