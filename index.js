var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'html');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const env = "" + process.env.NODE_ENV;
const config = require('./config/db')["dev" || env];
console.log(config);

mongoose.connect(config.database, { useNewUrlParser: true });

const UserController = require('./controllers/UserController');
app.use('/users', UserController);

const PORT = process.env.PORT || 8080;
app.listen(PORT);

module.exports = app;