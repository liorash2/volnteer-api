const { ObjectId } = require('mongodb');
const MongoService = require("../services.mongo");

class MongoUsersService extends MongoService {
    static usersCollection = "users";
    async addUser(user) {
        try {
            await this.init();
            var collection = await this.db.collection(MongoUsersService.usersCollection);
            var existUser = await collection.findOne({ email: user.email });
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
            var collection = await this.db.collection(MongoUsersService.usersCollection);
            const customer = await collection.findOne({ email: email });
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
            const collection = await this.db.collection(MongoUsersService.usersCollection);
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
            const collection = await this.db.collection(MongoUsersService.usersCollection);
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
            const collection = await this.db.collection(MongoUsersService.usersCollection);
            const res = await collection.deleteOne({ _id: ObjectId(_id) });
        }
        catch (err) {
            return new Error(err);
        }
        finally {
            await this.destroy();
        }
    }
}

module.exports = MongoUsersService;