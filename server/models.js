var mongoose = require('mongoose'),
    config = require('./config/config'),
    Schema = mongoose.Schema,
    stream_node=require('getstream-node');

    mongoose.Promise = global.Promise;

    var connection = mongoose.connect(config.db.URI);

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
            ref:'ReviewPost'
        }],
        discussions:[{
            type: Schema.Types.ObjectId,
            ref:'DiscussionPost'
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
      
      discussionPostSchema.plugin(StreamMongoose.activity);

      discussionPostSchema.statics.pathsToPopulate = function() {
          return ['user'];
      };

      var DiscussionPost = mongoose.model('DiscussionPost',discussionPostSchema);

//------------------------------------------------------------------------

var reviewPostSchema = new Schema({

        user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
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
    
          reviewPostSchema.statics.pathsToPopulate = function() {
              return ['user'];
          };

      reviewPostSchema.plugin(StreamMongoose.activity);

      reviewPostSchema.statics.pathsToPopulate = function() {
        return ['user'];
    };
    
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
        return ['user', 'target'];
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

    StreamMongoose.setupMongoose(mongoose);

    module.exports = {
        User: User,
        DiscussionPost: DiscussionPost,
        ReviewPost: ReviewPost,
        Follow: Follow
    };
