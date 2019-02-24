var mongoose = require('mongoose'),
    config = require('./config/config'),
    Schema = mongoose.Schema,
    stream_node=require('getstream-node');

    mongoose.Promise = global.Promise;

    var connection = mongoose.connect('mongodb://dev:passw0rd@ds127015.mlab.com:27015/filmapp');

    var FeedManager = stream_node.FeedManager;
    var StreamMongoose = stream_node.mongoose;

//------------------------------------------------------------------------
    var userSchema = new Schema({

        username: {
            type: String,
            unique:true
        },
        password: String,
        email: String,
        favoriteMovies: [String],
        favoriteGenres: [String],
        watchlist: [String],
        watched: [String],
        avatar: String, //image url
        reviews:[{
            type: Schema.Types.ObjectId,
            ref:'ReviewPost',
            autopopulate: true
        }],
        discussions:[{
            type: Schema.Types.ObjectId,
            ref:'DiscussionPost',
            autopopulate: true
        }],
    
        admin: {
            type: Boolean,
            default: false
        }
    
    }, {collection: 'User'});

    
    userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };
    
    userSchema.methods.validPassword = function(password){
        return bcrypt.compareSync(password, this.password);
    };

    userSchema.plugin(require('mongoose-autopopulate'));

    var User = mongoose.model('User', userSchema);

//------------------------------------------------------------------------


var discussionPostSchema = new Schema({

    user: { type: Schema.Types.ObjectId, required: true, ref: 'User', autopopulate: true },
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
      
      discussionPostSchema.plugin(StreamMongoose.activity);
      discussionPostSchema.plugin(require('mongoose-autopopulate'));

      var DiscussionPost = mongoose.model('DiscussionPost',discussionPostSchema);

//------------------------------------------------------------------------

var reviewPostSchema = new Schema({

        user: { type: Schema.Types.ObjectId, required: true, ref: 'User', autopopulate: true },
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
          
          reviewPostSchema.plugin(StreamMongoose.activity);
          reviewPostSchema.plugin(require('mongoose-autopopulate'));
       
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
            ref:'User',
            autopopulate: true
        },
        target: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        
    
    }, {collection: 'Follow'});

    followSchema.plugin(StreamMongoose.activity);
    followSchema.plugin(require('mongoose-autopopulate'));

    followSchema.methods.activityNotify = function() {
        target_feed = FeedManager.getNotificationFeed(this.target._id);
        return [target_feed];
    };
    
    followSchema.methods.activityForeignId = function() {
        return this.user._id + ':' + this.target._id;
    };
    

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
            ref:'User',
            autopopulate:true
        },
        movie: String
        
    
    }, {collection: 'Watch'});

    watchSchema.plugin(StreamMongoose.activity);
    watchSchema.plugin(require('mongoose-autopopulate'));

    
    var Watch = mongoose.model('Watch', watchSchema);


    StreamMongoose.setupMongoose(mongoose);

    module.exports = {
        User: User,
        DiscussionPost: DiscussionPost,
        ReviewPost: ReviewPost,
        Follow: Follow,
        Watch: Watch
    };
