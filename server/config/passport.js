var passport = require('passport'),
    LocalStrategy = require('passport-local'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, function(username, password, done){
    User.findOne({username: username}).then(function(user){
        if(!user || !user.validPassword(password)){
            return done(null, false, {errors: {"username or password":"is invalid."}})
        }
        return done(null, user);
    }).catch(done);
}));