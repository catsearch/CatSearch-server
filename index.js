const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const env = "" + process.env.NODE_ENV;
const config = require('./config/db')["dev" || env];
mongoose.connect(config.database, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use('/user', userRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT);

module.exports = app;