var mongoose = require('mongoose'),
    config = require('./config/config'),
    Schema = mongoose.Schema,
    stream_node=require('getstream-node'),
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
            unique:true,
            required: true
        },
        email: String,

        salt: String, //password salt
        hash: String, //password hash

        favoriteMovies:[Schema.Types.Mixed],
        favoriteGenres: [String],

        watchlist: [Schema.Types.Mixed],
        watched: [Schema.Types.Mixed],

        avatar: {
            type: String,
            default: 'default_avatar.jpg'
        }, //image url

        reviews:[{
            type: Schema.Types.ObjectId,
            ref:'ReviewPost'
        }],

        discussions:[{
            type: Schema.Types.ObjectId,
            ref:'DiscussionPost'
        }],
    
        role: {
            type: String,
            default: 'editor'
        }
    
    }, {collection: 'User'});

   
    userSchema.plugin(uniqueValidator, {message: "is already taken."});

    userSchema.methods.setPassword = function(password){
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    };

    userSchema.methods.validPassword = function(password){
        var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        return this.hash === hash;
    };

    userSchema.methods.generateJWT = function(){
        var today = new Date();
        var exp = new Date(today);
        exp.setDate(today.getDate()+60);

        return jwt.sign({
            id: this._id,
            username: this.username,
            exp: parseInt(exp.getTime()/1000)
        }, config.secret)
    };

    userSchema.methods.toAuthJSON = function(){
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

    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: {
        type: String,
        required:true
    },
    description: String,
    upVotes:Number,
    comments:[String],
    created_at:Date,
    updated_at:Date

}, {collection: 'DiscussionPost'});

discussionPostSchema.pre('save',function(next) {
    var currentDate=new Date();
    this.updated_at=currentDate;
    
    if(!this.created_at)
        this.created_at=currentDate;
    
    next();
  });

  discussionPostSchema.statics.pathsToPopulate = function() {
	return ['user'];
};
      
      discussionPostSchema.plugin(StreamMongoose.activity);
    

      var DiscussionPost = mongoose.model('DiscussionPost',discussionPostSchema);

//------------------------------------------------------------------------

var reviewPostSchema = new Schema({

        user: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
        movie: {
            type: String,
            required:true
        },
        description:String,
        rating:Number,
        upVotes:Number,
        created_at:Date,
        updated_at:Date
    
    }, {collection: 'ReviewPost'});

    reviewPostSchema.statics.pathsToPopulate = function() {
        return ['user'];
    };
          
          reviewPostSchema.plugin(StreamMongoose.activity);
         
       
    reviewPostSchema.pre('save',function(next) {
        var currentDate=new Date();
        this.updated_at=currentDate;
        
        if(!this.created_at)
            this.created_at=currentDate;
        
        next();
      });


    var ReviewPost = mongoose.model('ReviewPost',reviewPostSchema);
      
//------------------------------------------------------------------------

    var followSchema = new Schema({

        user: {
            type: Schema.Types.ObjectId,
            required:true,
            ref:'User'
        },
        target: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        created_at:Date
    
    }, {collection: 'Follow'});

    followSchema.plugin(StreamMongoose.activity);

    followSchema.methods.activityNotify = function() {
        target_feed = FeedManager.getNotificationFeed(this.target._id);
        return [target_feed];
    };
    
    followSchema.methods.activityForeignId = function() {
        return this.user._id + ':' + this.target._id;
    };

    followSchema.statics.pathsToPopulate = function() {
        return ['user','target'];
    };

    followSchema.pre('save',function(next) {
        var currentDate=new Date();     
        if(!this.created_at)
            this.created_at=currentDate;
        
        next();
      });
    

    followSchema.post('save', function(doc) {
        if (doc.wasNew) {
            var userId = doc.user._id || doc.user;
            var targetId = doc.target._id || doc.target;
            FeedManager.followUser(userId, targetId);
        }
    });
    
    followSchema.post('remove', function(doc) {
        FeedManager.unfollowUser(doc.user, doc.target);
    });
    
    var Follow = mongoose.model('Follow', followSchema);

    //---------------------------------------------------
    var watchSchema = new Schema({

        user: {
            type: Schema.Types.ObjectId,
            required:true,
            ref:'User'
        },
        movie: String,
        created_at:Date
        
    
    }, {collection: 'Watch'});

    watchSchema.pre('save',function(next) {
        var currentDate=new Date();     
        if(!this.created_at)
            this.created_at=currentDate;
        
        next();
      });

      watchSchema.statics.pathsToPopulate = function() {
        return ['user'];
    };
    watchSchema.plugin(StreamMongoose.activity);
    
    var Watch = mongoose.model('Watch', watchSchema);


    StreamMongoose.setupMongoose(mongoose);

    module.exports = {
        User: User,
        DiscussionPost: DiscussionPost,
        ReviewPost: ReviewPost,
        Follow: Follow,
        Watch: Watch
    };
