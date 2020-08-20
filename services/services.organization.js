const OrganizationModel = require("../models/model.organization");
const UserModel = require("../models/model.customer");
const MongoService = require("./mongo/service.mongo.organization");
const UserMongoSerive = require('./mongo/service.mongo.users');
const CustomerModel = require("../models/model.customer");

let Validator = require('fastest-validator');
/* create an instance of the validator */
let organizationValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;
/* customer validator shema */
const organizationVSchema = {
    name: { type: "string", min: 1, max: 50 },
    password: { type: "string", min: 4 },
    email: { type: "email" },
    maxVolunteers: { type: "number", integer: true, positive: true },
    hobbyID: { type: "number", integer: true, positive: true },
    regionCode: { type: "string", min: 1, max: 4 },
    end: { type: "date", convert: true },
    start: { type: "date", convert: true }

};
class OrganizationService {
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

        let organization = new OrganizationModel(data);
        let mongoService = new MongoService();
        const res = await mongoService.addOrganization(organization);
        if (res instanceof Error) {
            throw {
                name: 'OperationError',
                message: res.message
            }
        }
        //create user
        const user = new CustomerModel(data.name, '', data.email, data.password, 'organization', organization._id.toString());
        const userMongoService = new UserMongoSerive();
        const createUser = await userMongoService.addUser(user);
        if (createUser instanceof Error) {
            //need to delete org
            await mongoService.deleteOrganization(organization._id.toString());
            throw {
                name: 'OperationError',
                message: createUser.message
            }
        }
        return organization;
    }

    static async retrieve(organizationID) {
        let mongoService = new MongoService();
        const customer = await mongoService.get(organizationID);
        if (customer instanceof Error) {
            throw customer;
        }
        if (customer == null) {
            throw new Error('Unable to retrieve a customer by (email:' + email + ')');
        }
        return customer;
    }

    static async update(_id, data) {
        let mongoService = new MongoService();
        delete data._id;
        const organization = await mongoService.updateOrganization(_id, data);
        if (organization instanceof Error) {
            throw organization;
        }
        if (organization == null) {
            throw new Error('Unable to retrieve a customer by (uid:' + cuid + ')');
        }
        return organization;
    }

    static async delete(_id) {
        let mongoService = new MongoService();
        var deleteRes = await mongoService.deleteOrganization(_id);
        if (deleteRes instanceof Error) {
            throw deleteRes;
        }
    }

    static async retrieveAll() {
        let mongoService = new MongoService();
        const allOrganizations = await mongoService.getAllOrganizations();
        if (allOrganizations instanceof Error) {
            throw allOrganizations;
        }
        return allOrganizations;
    }
}

module.exports = OrganizationService;