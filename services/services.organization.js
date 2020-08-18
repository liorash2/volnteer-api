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
        let mongoService = new MongoService();
        const res = await mongoService.addOrganization(organization);
        if (res instanceof Error) {
            throw {
                name: 'OperationError',
                message: res.message
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