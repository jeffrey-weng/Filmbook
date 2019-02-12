var express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    config = require('./config'),
    passport = require('passport');

module.exports.init = function() {

    mongoose.connect(config.db.uri);

    var app = express();

    app.use(express.static(__dirname + '/../../client'));

    return app;
};

