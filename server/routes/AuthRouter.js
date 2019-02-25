var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    auth = require('./auth.js'),
    passport = require('passport'),
    AuthRouter = require('express').Router();


//Middleware that converts error objects into simple JSON
AuthRouter.use(function(err,req,res,next){
    if(err.name === 'ValidationError'){
        return res.json({
            errors: Object.keys(err.errors).reduce(function(errors ,key){
                errors[key] = err.errors[key].message;
                return errors;
            }, {})
        })
    }
    return next(err);
});

//Register route: /auth/register
AuthRouter.post('/register', function(req,res,next){

    if (!req.body.username || !req.body.password){
        return res.status(422).json({error: 'Missing username and/or password!'});
    }
    else{
        var user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.setPassword(req.body.password);
    }

    user.save().then(function(){
        return res.json({user: user.toAuthJSON()});
    }).catch(next);
});

//Login route: /auth/login
AuthRouter.post('/login', function(req,res,next){
    if(!req.body.username){
        return res.status(422).json({error: "Username cannot be blank."});
    }

    if(!req.body.password){
        return res.status(422).json({error: "Password cannot be blank."});
    }

    passport.authenticate('local', {session: false}, function(err, user, info){
        if(err){return next(err);}

        if(user){
            user.token = user.generateJWT();
            return res.json({success: true, user: user.toAuthJSON()});
        } else {
            return res.status(422).json({info: info});
        }
    })(req,res,next);
});

AuthRouter.post('/logout', function(req, res, next){
   if(req.body.user) { req.logout(); return res.status(200);}
});



module.exports = AuthRouter;