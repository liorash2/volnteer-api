let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

const generate_uid = require('./routes/generate_uid');
const users = require('./routes/users');
const customer = require('./routes/customer');
const organization = require('./routes/organization');
const hobbiesRoute = require('./routes/hobbies.route');
const regionRouter = require('./routes/regions.route');
const volunteerRoute = require('./routes/volunteer.route');

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
app.use('/api/v1/regions', regionRouter);
app.use('/api/v1/volunteer', volunteerRoute);

app.use('/api/v1/generate_uid', generate_uid);
module.exports = app;


