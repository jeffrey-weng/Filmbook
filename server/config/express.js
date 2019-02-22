var express = require('express'),
    expressLayouts = require('express-ejs-layouts'),
    expressSession = require('express-session'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    config = require('./config'),
    passport = require('passport'),
    routes = require('../routes');

module.exports.init = function() {

    mongoose.connect(config.db.uri);

    var app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('static'));

    app.use(
        expressSession({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false,
        }),
    );
    
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api',routes);

    /*Go to homepage for all routes not specified */ 
    app.use('/*',function(req,res,next){
	 res.redirect('/');
  });


    return app;
};

