class VolunteerModel {

    firstName; lastName; email; password; birthDay; phone; regions; hobbies; start; end;


    constructor(obj) {
        obj && Object.assign(this, obj);

    }

}
module.exports = VolunteerModel;