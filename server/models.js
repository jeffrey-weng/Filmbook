var mongoose = require('mongoose'),
    config = require('./config/config'),
    Schema = mongoose.Schema,
    stream_node = require('getstream-node'),
    uniqueValidator = require('mongoose-unique-validator'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;

var connection = mongoose.connect('mongodb://dev:passw0rd@ds127015.mlab.com:27015/filmapp');

var FeedManager = stream_node.FeedManager;
var StreamMongoose = stream_node.mongoose;

//------------------------------------------------------------------------
var userSchema = new Schema({

    username: {
        type: String,
        unique: true,
        required: true
    },
    email: String,

    salt: String, //password salt
    hash: String, //password hash

    favoriteMovies: [Schema.Types.Mixed],
    favoriteGenres: [String],

    watchlist: [Schema.Types.Mixed],
    watched: [Schema.Types.Mixed],

    avatar: {
        type: String,
        default: 'https://minervastrategies.com/wp-content/uploads/2016/03/default-avatar.jpg'
    }, //image url

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],

    discussions: [{
        type: Schema.Types.ObjectId,
        ref: 'DiscussionPost'
    }],

    role: {
        type: String,
        default: 'editor'
    }

}, {
    collection: 'User'
});


userSchema.plugin(uniqueValidator, {
    message: "is already taken."
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 30);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, config.secret)
};

userSchema.methods.toAuthJSON = function () {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        favoriteMovies: this.favoriteMovies,
        favoriteGenres: this.favoriteGenres,
        watchlist: this.watchlist,
        watched: this.watched,
        role: this.role,
        avatar: this.avatar,
        token: this.generateJWT()
    };
};

var User = mongoose.model('User', userSchema);

//------------------------------------------------------------------------


var discussionPostSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: String,
    description: String,
    upVotes: Number,
    comments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment'
    },
    created_at: Date,
    updated_at: Date

}, {
    collection: 'Post'
});

discussionPostSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

discussionPostSchema.statics.pathsToPopulate = function () {
    return ['user','comments'];
};

discussionPostSchema.plugin(StreamMongoose.activity);


var DiscussionPost = mongoose.model('Post', discussionPostSchema);

//------------------------------------------------------------------------

var commentSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    discussion:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'Post'
    },
    description: {
        type: String,
        required: true
    },
    created_at: Date,
    updated_at: Date

}, {
    collection: 'Comment'
});

commentSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

commentSchema.statics.pathsToPopulate = function () {
    return ['user','discussion'];
};

commentSchema.plugin(StreamMongoose.activity);


var Comment = mongoose.model('Comment', commentSchema);

//------------------------------------------------------------------------


var reviewSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    movie: {
        type: String,
        required: true
    },
    description: String,
    rating: Number,
    upVotes: {
        type: Number,
        default: 0
    },
    created_at: Date,
    updated_at: Date

}, {
    collection: 'Review'
});

reviewSchema.statics.pathsToPopulate = function () {
    return ['user'];
};

reviewSchema.plugin(StreamMongoose.activity);


reviewSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;
    if (!this.upVotes)
        this.upVotes = 0;

    next();
});


var Review = mongoose.model('Review', reviewSchema);

//------------------------------------------------------------------------

var followSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    target: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    created_at: Date

}, {
    collection: 'Follow'
});

followSchema.plugin(StreamMongoose.activity);

followSchema.methods.activityNotify = function () {
    target_feed = FeedManager.getNotificationFeed(this.target._id);
    return [target_feed];
};

followSchema.methods.activityForeignId = function () {
    return this.user._id + ':' + this.target._id;
};

followSchema.statics.pathsToPopulate = function () {
    return ['user', 'target'];
};

followSchema.pre('save', function (next) {
    var currentDate = new Date();
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


followSchema.post('save', function (doc) {
    if (doc.wasNew) {
        var userId = doc.user._id || doc.user;
        var targetId = doc.target._id || doc.target;
        FeedManager.followUser(userId, targetId);
    }
});

followSchema.post('remove', function (doc) {
    FeedManager.unfollowUser(doc.user, doc.target);
});

var Follow = mongoose.model('Follow', followSchema);

//---------------------------------------------------
var watchSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    movie: String,
    created_at: Date


}, {
    collection: 'Watch'
});

watchSchema.pre('save', function (next) {
    var currentDate = new Date();
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

watchSchema.statics.pathsToPopulate = function () {
    return ['user'];
};
watchSchema.plugin(StreamMongoose.activity);

var Watch = mongoose.model('Watch', watchSchema);


StreamMongoose.setupMongoose(mongoose);

module.exports = {
    User: User,
    DiscussionPost: DiscussionPost,
    Review: Review,
    Follow: Follow,
    Watch: Watch,
    Comment: Comment
};