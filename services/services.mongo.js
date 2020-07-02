const { ObjectId } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;

const getUser = async function (collection, email) {
    return await collection.findOne({ email: email });
}

class MongoService {

    static dbName = "volunteers";
    static uri = "mongodb+srv://administrator:wvxNVYswOPWLt7mR@cluster0.4rwmr.azure.mongodb.net/<dbname>?retryWrites=true&w=majority";
    static usersCollection = "users";
    static async addUser(user) {
        try {
            const client = await MongoClient.connect(MongoService.uri, { useNewUrlParser: true });
            const db = await client.db(MongoService.dbName);
            const collection = await db.collection(MongoService.usersCollection);

            var existUser = await getUser(collection, user.email);
            if (existUser) {
                return new Error(`User ${user.email} already exists`);
            }

            const res = await collection.insertOne(user);

            console.log('1 document inserted');
            client.close();
        }
        catch (err) {
            return new Error(err);
        }
    }
    static async getUser(email) {
        try {
            const client = await MongoClient.connect(MongoService.uri, { useNewUrlParser: true });
            const db = await client.db(MongoService.dbName);
            const collection = await db.collection(MongoService.usersCollection);
            const customer = await getUser(collection, email);
            client.close();
            return customer;
        } catch (err) {
            return new Error(err);
        }


    }
    static async updateUser(_id, user) {
        try {
            const client = await MongoClient.connect(MongoService.uri, { useNewUrlParser: true });
            const db = await client.db(MongoService.dbName);
            const collection = await db.collection(MongoService.usersCollection);

            const res = await collection.updateOne({ _id: _id }, { $set: user });
            client.close();

        }
        catch (err) {
            return new Error(err);
        }
    }

    static async deleteUser(_id) {
        try {
            const client = await MongoClient.connect(MongoService.uri, { useNewUrlParser: true });
            const db = await client.db(MongoService.dbName);
            const collection = await db.collection(MongoService.usersCollection);

            const res = await collection.deleteOne({ _id: ObjectId(_id) });
            client.close();

        }
        catch (err) {
            return new Error(err);
        }

    }



}

module.exports = MongoService;