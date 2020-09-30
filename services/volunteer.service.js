const VolunteerMongoService = require("./mongo/service.mongo.volunteer");
const CustomerModel = require("../models/model.customer");
const UserMongoSerive = require('./mongo/service.mongo.users');
const VolunteerModel = require('../models/model.volunteer');
const OrganizationMongoService = require('./mongo/service.mongo.organization');


let Validator = require('fastest-validator');
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
        let mongoService = new VolunteerMongoService();
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
        let mongoService = new VolunteerMongoService();
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
        let mongoService = new VolunteerMongoService();
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
        let mongoService = new VolunteerMongoService();
        var deleteRes = await mongoService.Delete(email);
        if (deleteRes instanceof Error) {
            throw deleteRes;
        }
    }

    static async retrieveAll() {
        let mongoService = new VolunteerMongoService();
        const allVolunteers = await mongoService.getAll();
        if (allVolunteers instanceof Error) {
            throw allVolunteers;
        }
        return allVolunteers;
    }

    static async GetOrganizationForVolunteer(email) {
        //find volunteer
        let volunteer = await VolunteerService.retrieve(email); //will throw exception if failed or not exists

        let organizationService = new OrganizationMongoService();

        let query = {};

        query.volunteers = { $in: [email] };

        const organizationAlreadyVolunteer = await organizationService.getAllOrganizations(query);
        if (organizationAlreadyVolunteer instanceof Error) {
            throw organizationAlreadyVolunteer;
        }
        if (organizationAlreadyVolunteer.length > 0) {
            return [];
        }
        
        query = {};
        //region
        query.regionCode = { $in: volunteer.regions };
        query.hobbyID = { $in: volunteer.hobbies };
        query.start = {
            $gte: new Date(volunteer.start)
        };
        query.end = {
            $lt: new Date(volunteer.end)
        };
        let organizationRes = await organizationService.getAllOrganizations(query);
        if (organizationRes instanceof Error) {
            throw organizationRes;
        }
        if (organizationRes && organizationRes.length) {
            organizationRes = organizationRes.filter(o => (!o.volunteers || o.maxVolunteers > o.volunteers.length));
        }
        return organizationRes;
    }

    static async register(email, organizationID) {
        let organizationService = new OrganizationMongoService();
        const organization = await organizationService.getOrganizationByID(organizationID);
        if (!organization) {
            throw new Error('organization with ID ' + organizationID + ' does not exist.');
        }
        if (organization instanceof Error) {
            throw organization;
        }
        organization.volunteers = organization.volunteers || [];
        if (organization.volunteers.find(v => v === email)) {
            throw new Error('volunteer ' + email + ' already registered to organization (id = ' + organizationID + ')');
        }
        organization.volunteers.push(email);
        const updateRes = await organizationService.updateOrganization(organizationID, { volunteers: organization.volunteers });
        if (updateRes instanceof Error) {
            throw updateRes;
        }
    }
}

module.exports = VolunteerService;