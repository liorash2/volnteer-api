const OrganizationModel = require("../models/model.organization");
const MongoService = require("./services.mongo");

let Validator = require('fastest-validator');

/* create an instance of the validator */
let organizationValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;
/* customer validator shema */
const organizationVSchema = {
    name: { type: "string", min: 1, max: 50, pattern: namePattern }
};

/* static customer service class */
class OrganizationService {
    static async create(data) {

        var validateRes = organizationValidator.validate(data, organizationVSchema);
        if (!validateRes) {
            let errors = {}, item;

            for (const index in vres) {
                item = vres[index];
                errors[item.field] = item.message;
            }

            throw {
                name: "ValidationError",
                message: errors
            };
        }

        let organization = new OrganizationModel(data.name);
        const res = await MongoService.addOrganization(organization);
        if (res instanceof Error) {
            throw {
                name: 'OperationError',
                message: res.message
            }
        }
        return organization;
    }

    static async retrieve(email) {
        const customer = await MongoService.getUser(email);
        if (customer instanceof Error) {
            throw customer;
        }
        if (customer == null) {
            throw new Error('Unable to retrieve a customer by (email:' + email + ')');
        }
        return customer;
    }

    static async update(_id, data) {
        const customer = MongoService.updateUser(_id, data);
        if (customer instanceof Error) {
            throw customer;
        }
        if (customer == null) {
            throw new Error('Unable to retrieve a customer by (uid:' + cuid + ')');
        }
    }

    static async delete(_id) {
        var deleteRes = await MongoService.deleteUser(_id);
        if (deleteRes instanceof Error) {
            throw deleteRes;
        }
    }

    static async retrieveAll() {
        const allOrganizations = await MongoService.getAllOrganizations();
        if (allOrganizations instanceof Error) {
            throw allOrganizations;
        }
        return allOrganizations;
    }
}

module.exports = OrganizationService;