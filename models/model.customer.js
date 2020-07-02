class CustomerModel {
    
    constructor(first_name, last_name, email, password, role) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.role = role;
        this._id = null;
    }
}

module.exports = CustomerModel;