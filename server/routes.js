var config = require('./config/config'),
	express = require('express'),
	models = require('./models'),
	passport = require('passport'),
	_ = require('underscore'),
	async = require('async'),
	stream_node = require('getstream-node'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

	/*server crud controllers*/
	discussions = require('./controllers/discussion.server.controller.js'),
	reviews = require('./controllers/review.server.controller.js'),
	users = require('./controllers/users.server.controller.js');
	follows = require('./controllers/follow.server.controller.js');
	watches = require('./controllers/watch.server.controller.js');

	/*router and models*/
var router = express.Router(),
	User = models.User,
    DiscussionPost = models.DiscussionPost,
    ReviewPost=models.ReviewPost,
	Follow = models.Follow,
	Watch = models.Watch;

/*stream api stuff*/
var FeedManager = stream_node.FeedManager;
var StreamMongoose = stream_node.mongoose;
var StreamBackend = new StreamMongoose.Backend();


var enrichActivities = function(body) {
	var activities = body.results;
	return StreamBackend.enrichActivities(activities);
};

/*passport stuff*/
var ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};


/*helper function that might be helpful*/
var did_i_follow = function(users, followers) {
	var followed_users_ids = _.map(followers, function(item) {
		return item.target.toHexString();
	});
	_.each(users, function(user) {
		if (followed_users_ids.indexOf(user._id.toHexString()) !== -1) {
			user.followed = true;
		}
	});
};

/*some more stream configuration*/
router.use(function(req, res, next) {
	if (req.isAuthenticated()) {
		res.locals = {
			StreamConfigs: stream_node.settings,
			NotificationFeed: FeedManager.getNotificationFeed(
				req.user.id
			)
		};
	}
	next();
});

/*error-checking middleware*/
router.use(function(error, req, res, next) {
	if (!error) {
		next();
	} else {
		console.error(error.stack);
		res.send(500);
	}
});

/*populating authenticated user's 'req.user' property with useful fields..and something with notifications*/
router.use(function(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	} else if (!req.user.id) {
		User.findOne({ username: req.user.username })
			.lean()
			.exec(function(err, user) {
				if (err) return next(err);

				notificationFeed = FeedManager.getNotificationFeed(user._id);

				req.user.id = user._id;
				req.user.token = notificationFeed.token;
				req.user.APP_ID = FeedManager.settings.apiAppId;
				req.user.APP_KEY = FeedManager.settings.apiKey;

				notificationFeed.get({ limit: 0 }).then(function(body) {
					if (typeof body !== 'undefined')
						req.user.unseen = body.unseen;
					next();
				});
			});
	} else {
		next();
	}
});

/*to parse POST request url-encoded bodies*/
router.use(bodyParser.urlencoded({ extended: true }));

/*To allow deletion in a url encoded form*/
router.use(
	methodOverride(function(req, res) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			// look in urlencoded POST bodies and delete it
			var method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

/*fetches feed data for logged-in user (View: home.html)*/
router.get('/', ensureAuthenticated, function(req, res, next) {

	var flatFeed = FeedManager.getNewsFeeds(req.user.id)['timeline'];

	flatFeed
		.get({})
		.then(enrichActivities)
		.then(function(enrichedActivities) {
			res.json(
				{location: 'home',
				user: req.user,
				activities: enrichedActivities, //feed data
				path: req.url,
			});
		})
		.catch(next);
	});

		

/******************
  Logged-In User Profile (View: profile.html)
******************/

router.get('/profile', ensureAuthenticated, function(req, res, next) {
	var userFeed = FeedManager.getUserFeed(req.user.id);
	var enrichment,userData,Followers,Following;
	userFeed
		.get({})
		.then(enrichActivities)
		.then(function(enrichedActivities) {
			enrichment=enrichedActivities;
		});

	User.findOne({username:req.user.username}).lean().exec(function(err, user) {
				if (err) return err;
			
					 userData = user;
				
			}
		);

	Follow.find({target:req.user.id}).lean().exec(function(err,followers){
			if(err){
				console.log(err);
				res.status(400).send(err);
			}
			else{
				Followers=followers;
			}
			
			});
		
		Follow.find({user:req.user.id}).lean().exec(function(err,following){
				if(err){
					console.log(err);
					res.status(400).send(err);
				}
				else{
					Following=following;
				}
				
				});
		
			res.json({
				location: 'profile',
				activities: enrichment,
				user: userData,
				followers: Followers, //access followers by foreach x in followers: x.user
				following: Following, //access followers by foreach x in following: x.target
				path: req.url,
				show_feed: true,
			});
		next();
});


/*used when viewing other people's profiles*/
router.get('/profile/:user', ensureAuthenticated, function(req, res, next) {
	User.findOne({ username: req.params.user }, function(err, foundUser) {
		if (err) return next(err);

		if (!foundUser)
			return res.send('User ' + req.params.user + ' not found.');

		var flatFeed = FeedManager.getNewsFeeds(foundUser._id)['flat'];
		var enrichment,userData,Followers,Following;

		flatFeed
		.get({})
		.then(enrichActivities)
		.then(function(enrichedActivities) {
			enrichment=enrichedActivities;
		});

	User.findOne({username:foundUser.username}).lean().exec(function(err, user) {
				if (err) return err;
			
					 userData = user;
				
			}
		);

	Follow.find({target:foundUser._id}).lean().exec(function(err,followers){
			if(err){
				console.log(err);
				res.status(400).send(err);
			}
			else{
				Followers=followers;
			}
			
			});
		
		Follow.find({user:foundUser._id}).lean().exec(function(err,following){
				if(err){
					console.log(err);
					res.status(400).send(err);
				}
				else{
					Following=following;
				}
				
				});
		
			res.json({
				location: 'profile',
				activities: enrichment,
				user: userData,
				followers: Followers,  //access followers by foreach x in followers: x.user
				following: Following, //access followers by foreach x in following: x.target
				path: req.url,
				show_feed: true,
			});
		next();
})});

/******************
  Follow
******************/

/*should trigger when logged in user follows another user*/
router.post('/follow', ensureAuthenticated, function(req, res, next) {
	User.findOne({ _id: req.body.target }, function(err, target) {
		if (target) {
			var followData = { user: req.user.id, target: req.body.target };
			var follow = new Follow(followData);
			follow.save(function(err) {
				if (err) next(err);
				res.set('Content-Type', 'application/json');
				return res.send({ follow: { id: req.body.target } });
			});
		} else {
			res.status(404).send('Not found');
		}
	});
});

/*should trigger when logged in user unfollows another user*/
router.delete('/follow', ensureAuthenticated, function(req, res) {
	Follow.findOne({ user: req.user.id, target: req.body.target }, function(
		err,
		follow
	) {
		if (follow) {
			follow.remove(function(err) {
				if (err) next(err);
				res.set('Content-Type', 'application/json');
				return res.send({ follow: { id: req.body.target } });
			});
		} else {
			res.status(404).send('Not found');
		}
	});
});


//Local APIs with standard CRUD operations (similar to bootcamp assignment)

//Discussion API
router.route('/discussions').get(discussions.list).post(discussions.create);

router.route('/discussions/:discussionId')
.get(discussions.read)
.put(discussions.update)
.delete(discussions.delete);

router.param('discussionId',discussions.DiscussionByID);

//Review API
router.route('/reviews').get(reviews.list).post(reviews.create);

router.route('/reviews/:reviewId')
.get(reviews.read)
.put(reviews.update)
.delete(reviews.delete);

router.param('reviewId',reviews.ReviewByID);


//User API
router.route('/users').get(users.list).post(users.create);

router.route('/users/:userId')
.get(users.read)
.put(users.update)
.delete(users.delete);

//Watch API
router.route('/watch/:user').get(watches.getAllWatched);
router.route('/watch').post(watches.create);



router.param('userId',users.UserByID); //creates req.profile property with user object
router.param('user',users.UserByUserName); //creates req.profile property with user object


module.exports = router;