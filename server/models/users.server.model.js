var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema({

    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },

    followed: [String],
    following: [String],

    favoriteMovies: [String],
    favoriteGenres: [String],
    watchlist: [String],

    admin: {
        type: Boolean,
        default: false
    }

});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', UserSchema);

module.exports = User;