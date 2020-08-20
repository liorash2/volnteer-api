const MongoService = require("./mongo/service.mongo.volunteer");
const CustomerModel = require("../models/model.customer");
const UserMongoSerive = require('./mongo/service.mongo.users');
let Validator = require('fastest-validator');
const VolunteerModel = require('../models/model.volunteer');

/* create an instance of the validator */
let organizationValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;
/* customer validator shema */
const organizationVSchema = {
    firstName: { type: "string", min: 1, max: 50 },
    lastName: { type: "string", min: 1, max: 50 },
    password: { type: "string", min: 4 },
    email: { type: "email" },
    regions: { type: "array", items: { type: "string", min: 1 } },
    hobbies: { type: "array", items: { type: "number", positive: true, integer: true } },
    end: { type: "date", convert: true },
    birthDay: { type: "date", convert: true },
    start: { type: "date", convert: true }

};
class VolunteerService {
    static async create(data) {

        var validateRes = organizationValidator.validate(data, organizationVSchema);
        if (!(validateRes === true)) {
            let errors = {}, item;

            for (const index in validateRes) {
                item = validateRes[index];
                errors[item.field] = item.message;
            }

            throw {
                name: "ValidationError",
                message: errors
            };
        }

        let volunteer = new VolunteerModel(data);
        let mongoService = new MongoService();
        const res = await mongoService.Create(volunteer);
        if (res instanceof Error) {
            throw {
                name: 'OperationError',
                message: res.message
            }
        }
        //create user
        const user = new CustomerModel(data.firstName, data.lastName, data.email, data.password, 'volunteer', null);
        const userMongoService = new UserMongoSerive();
        const createUser = await userMongoService.addUser(user);
        if (createUser instanceof Error) {
            //need to delete org
            await mongoService.Delete(data.email);
            throw {
                name: 'OperationError',
                message: createUser.message
            }
        }
        return volunteer;
    }

    static async retrieve(email) {
        let mongoService = new MongoService();
        const volunteer = await mongoService.Get(email);
        if (volunteer instanceof Error) {
            throw volunteer;
        }
        if (volunteer == null) {
            throw new Error('Unable to retrieve a volunteer by (email:' + email + ')');
        }
        return volunteer;
    }

    static async update(data) {
        let mongoService = new MongoService();
        const email = data.email;
        const volunteerUpdateRes = await mongoService.Update(data);
        if (volunteerUpdateRes instanceof Error) {
            throw volunteerUpdateRes;
        }
        if (volunteerUpdateRes == null) {
            throw new Error('Unable to retrieve a volunteer by (email:' + email + ')');
        }
        return volunteerUpdateRes;
    }

    static async delete(email) {
        let mongoService = new MongoService();
        var deleteRes = await mongoService.Delete(email);
        if (deleteRes instanceof Error) {
            throw deleteRes;
        }
    }

    static async retrieveAll() {
        let mongoService = new MongoService();
        const allVolunteers = await mongoService.getAll();
        if (allVolunteers instanceof Error) {
            throw allVolunteers;
        }
        return allVolunteers;
    }
}

module.exports = VolunteerService;