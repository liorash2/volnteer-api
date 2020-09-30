const MongoService = require("../services.mongo");

class MongoVolunteerService extends MongoService {
    static collectionName = "voulnteers";

    async getAll(query) {
        try {
            await this.init();
            query = query || {};
            const collection = await this.db.collection(MongoVolunteerService.collectionName);
            return await collection.find(query).toArray();
        }
        catch (e) {
            return new Error(e.message);
        }
        finally {
            await this.destroy();
        }

    }

    async Get(email) {
        try {
            await this.init();
            const collection = await this.db.collection(MongoVolunteerService.collectionName);
            return await collection.findOne({ email: email });
        } catch (e) {
            return new Error(e.message);
        }
        finally {
            await this.destroy();
        }
    }
    async Create(data) {
        try {
            await this.init();
            const collection = await this.db.collection(MongoVolunteerService.collectionName);

            const existVolunteer = await collection.findOne({ email: data.email });
            if (existVolunteer) {
                return new Error(`Volunteer with email ${data.email} already exists`);
            }
            return await collection.insertOne(data);
        }
        catch (e) {
            return new Error(e.meesage);
        }
        finally {
            await this.destroy();
        }
    }
    async Update(data) {
        try {
            const email = data.email;
            delete data.email;
            await this.init();
            const collection = await this.db.collection(MongoVolunteerService.collectionName);
            return await collection.updateOne({ email: email }, { $set: data });

        } catch (e) {
            return new Error(e.message);
        } finally {
            await this.destroy();
        }
    }

    async Delete(email) {
        try {
            await this.init();
            const collection = await this.db.collection(MongoVolunteerService.collectionName);
            return await collection.deleteOne({ email: email });
        } catch (e) {
            return new Error(e.message);
        }
        finally {
            await this.destroy();
        }
    }
}
module.exports = MongoVolunteerService;