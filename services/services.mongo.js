const { ObjectId } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

const getUser = async function (collection, email) {
    return await collection.findOne({ email: email });
}

class MongoService {

    static dbName = "volunteers";
    static uri = "mongodb+srv://administrator:wvxNVYswOPWLt7mR@cluster0.4rwmr.azure.mongodb.net/<dbname>?retryWrites=true&w=majority";
    static usersCollection = "users";
    static organizationCollection = "organizations";
    static hobbiesCollection = "Voluntary_types";
    static regionsCollection = "regions";
    client;
    db;
    async init() {
        this.client = await MongoClient.connect(MongoService.uri, { useNewUrlParser: true });
        this.db = await this.client.db(MongoService.dbName);
    }
    async destroy() {
        if (this.client) {
            this.client.close();
        }
    }

    async addUser(user) {
        try {
            await this.init();
            var collection = await this.db.collection(MongoService.usersCollection);
            var existUser = await getUser(collection, user.email);
            if (existUser) {
                return new Error(`User ${user.email} already exists`);
            }
            const res = await collection.insertOne(user);
            console.log('1 document inserted');
        }
        catch (err) {
            return new Error(err);
        }
        finally {
            await this.destroy();
        }
    }
    async getUser(email) {
        try {
            await this.init();
            var collection = await this.db.collection(MongoService.usersCollection);
            const customer = await getUser(collection, email);
            return customer;
        } catch (err) {
            return new Error(err);
        }
        finally {
            await this.destroy();
        }
    }
    async getUsers() {
        try {
            await this.init();
            const collection = await this.db.collection(MongoService.usersCollection);
            const customer = await collection.find({}).toArray();
            return customer;
        } catch (err) {
            return new Error(err);
        }
        finally {
            await this.destroy();
        }


    }
    async updateUser(_id, user) {
        try {
            await this.init();
            const collection = await this.db.collection(MongoService.usersCollection);
            const res = await collection.updateOne({ _id: ObjectId(_id) }, { $set: user });
            user._id = _id;
            return user;
        }
        catch (err) {
            return new Error(err);
        }
        finally {
            await this.destroy();
        }
    }

    async deleteUser(_id) {
        try {
            await this.init();
            const collection = await this.db.collection(MongoService.usersCollection);
            const res = await collection.deleteOne({ _id: ObjectId(_id) });
        }
        catch (err) {
            return new Error(err);
        }
        finally {
            await this.destroy();
        }


    }
    async addOrganization(organization) {
        try {
            await this.init();
            const collection = await this.db.collection(MongoService.organizationCollection);

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
            var collection = await this.db.collection(MongoService.organizationCollection);
            return await collection.findOne({ _id: ObjectId(organizationId) });
        } catch (e) {
            return new Error(e);
        } finally {
            await this.destroy();
        }
    }

    async getAllOrganizations() {
        try {
            await this.init();
            const collection = await this.db.collection(MongoService.organizationCollection);

            var allOrganizations = await collection.find({}).toArray();
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
            let collection = await this.db.collection(MongoService.organizationCollection);
            const res = await collection.updateOne({ _id: ObjectId(_id) }, { $set: data });
            data._id = _id;
            return data;
        } catch (err) {
            return new Error(err.message);
        } finally {
            await this.destroy();
        }
    }

    async deleteOrganization(id) {
        try {
            await this.init();
            let collection = await this.db.collection(MongoService.organizationCollection);
            await collection.deleteOne({ _id: ObjectId(_id) });
        } catch (e) {
            return new Error(e.message);
        }
        finally {
            await this.destroy();
        }
    }


    async GetAllHobbies() {
        try {
            await this.init();
            let collection = await this.db.collection(MongoService.hobbiesCollection);
            return await collection.find({}).toArray();
        } catch (e) {
            return new Error(e.message);
        }
        finally {
            await this.destroy();
        }
    }


    async GetAllRegions() {
        try {

            await this.init();
            let collection = await this.db.collection(MongoService.regionsCollection);
            return await collection.find({}).toArray();
        } catch (e) {
            return new Error(e.message);
        }
        finally {
            await this.destroy();
        }
    }
}

module.exports = MongoService;