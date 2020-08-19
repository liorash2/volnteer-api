class OrganizationModel {


    name;
    password;
    email;
    phone;
    regionID;
    hobbyID;
    maxVolunteers;
    desc;
    end;
    start;
    constructor(obj) {
        obj && Object.assign(this, obj);

    }
}
module.exports = OrganizationModel;