let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let generate_uid = require('./routes/generate_uid');
let users = require('./routes/users');
let customer = require('./routes/customer');
let organization = require('./routes/organization');
let hobbiesRoute = require('./routes/hobbies.route');

var app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/api/v1/users', users);
app.use('/api/v1/customer', customer);
app.use('/api/v1/organization', organization);
app.use('/api/v1/hobbies', hobbiesRoute);

app.use('/api/v1/generate_uid', generate_uid);
module.exports = app;


