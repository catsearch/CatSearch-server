const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport')(passport);
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionSecret = require('./secret')["sessionSecret"];

const env = "" + process.env.NODE_ENV;
const config = require('./config/db')["dev" || env];
mongoose.connect(config.database, { useNewUrlParser: true });

app.set('view engine', 'html');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
	secret: sessionSecret,
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const UserController = require('./controllers/UserController');
const authRoutes = require('./controllers/auth');
const testRoutes = require('./controllers/test');
app.use('/users', UserController);
app.use('/auth', authRoutes);
app.use('/test', testRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT);

module.exports = app;