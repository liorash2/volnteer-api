const CustomerModel = require("../models/model.customer");
const MongoService = require("./services.mongo");

let Validator = require('fastest-validator');
const { MongoClient } = require("mongodb");


let customers = {};
let counter = 0;

/* create an instance of the validator */
let customerValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;
let zipCodePattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

/* customer validator shema */
const customerVSchema = {
    first_name: { type: "string", min: 1, max: 50, pattern: namePattern },
    last_name: { type: "string", min: 1, max: 50, pattern: namePattern },
    email: { type: "email", max: 75 },

    password: { type: "string", min: 2, max: 50, pattern: passwordPattern }
};

/* static customer service class */
class CustomerService {
    static async create(data) {
        var vres = customerValidator.validate(data, customerVSchema);

        /* validation failed */
        if (!(vres === true)) {
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

        let customer = new CustomerModel(data.first_name, data.last_name, data.email, data.password, data.role);
        let mongoService = new MongoService();
        const res = await mongoService.addUser(customer);
        if (res instanceof Error) {
            throw {
                name: 'OperationError',
                message: res.message
            }
        }
        return customer;
    }

    static async retrieve(email) {
        let mongoService = new MongoService();
        const customer = await mongoService.getUser(email);
        if (customer instanceof Error) {
            throw customer;
        }
        if (customer == null) {
            throw new Error('Unable to retrieve a customer by (email:' + email + ')');
        }
        return customer;
    }

    static async update(_id, data) {
        //delete _id  as it should NOT be updated in mongo
        delete data._id;
        let mongoService = new MongoService();
        const customer = await mongoService.updateUser(_id, data);
        if (customer instanceof Error) {
            throw customer;
        }
        if (customer == null) {
            throw new Error('Unable to retrieve a customer by (uid:' + cuid + ')');
        }
        return customer;
    }

    static async delete(_id) {
        let mongoService = new MongoService();
        var deleteRes = await mongoService.deleteUser(_id);
        if(deleteRes instanceof Error)
        {
            throw deleteRes;
        }        
    }

    static async retrieveAll(){
        let mongoService = new MongoService();
        const allCustomers = await mongoService.getUsers();
        if(allCustomers instanceof Error)
        {
            throw  allCustomers;
        }
        return allCustomers;
    }
}

module.exports = CustomerService;