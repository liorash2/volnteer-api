const { ObjectId } = require('mongodb');
const MongoService = require("../services.mongo");

class MongoOrganizationService extends MongoService {
    static organizationCollection = "organizations";

    async addOrganization(organization) {
        try {
            await this.init();
            const collection = await this.db.collection(MongoOrganizationService.organizationCollection);

            var existsOrganization = await collection.findOne({ email: organization.email });
            if (existsOrganization) {
                return new Error(`Organization with mail ${organization.email} already exists`);
            }
            const res = await collection.insertOne(organization);

            console.log('1 document inserted');

        }
        catch (err) {
            return new Error(err);
        }
        finally {
            await this.destroy();
        }
    }

    async getOrganizationByID(organizationId) {
        try {
            await this.init();
            var collection = await this.db.collection(MongoOrganizationService.organizationCollection);
            return await collection.findOne({ _id: ObjectId(organizationId) });
        } catch (e) {
            return new Error(e);
        } finally {
            await this.destroy();
        }
    }
    async GetByMail(email) {
        try {
            await this.init();
            const collection = await this.db.collection(MongoOrganizationService.organizationCollection);
            return await collection.findOne({ email: email });
        }
        catch (e) {
            return new Error(e);
        }
        finally {
            await this.destroy();
        }
    }
    async getAllOrganizations(query) {
        try {
            await this.init();
            const collection = await this.db.collection(MongoOrganizationService.organizationCollection);
            let allOrganizations;

            //reset query if null / undefined
            query = query || {};
            allOrganizations = await collection.find(query).toArray();
            return allOrganizations;
        } catch (err) {
            return new Error(err);
        }
        finally {
            await this.destroy();
        }
    }

    async updateOrganization(_id, data) {
        try {
            await this.init();
            let collection = await this.db.collection(MongoOrganizationService.organizationCollection);
            let updateResponse = await collection.updateOne({ _id: ObjectId(_id) }, { $set: data });
            if (!updateResponse.matchedCount) {
                return new Error("No organization matches id = " + _id);
            }
            if (!updateResponse.result.nModified) {
                return new Error("No records updated in DB.");
            }

            data._id = _id;
            return data;
        } catch (err) {
            return new Error(err.message);
        } finally {
            await this.destroy();
        }
    }

    async deleteOrganization(_id) {
        try {
            await this.init();
            let collection = await this.db.collection(MongoOrganizationService.organizationCollection);
            await collection.deleteOne({ _id: ObjectId(_id) });
        } catch (e) {
            return new Error(e.message);
        }
        finally {
            await this.destroy();
        }
    }
}
module.exports = MongoOrganizationService;