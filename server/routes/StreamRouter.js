var config = require('../config/config'),
	express = require('express'),
	models = require('../models'),
	passport = require('passport'),
	_ = require('underscore'),
	async = require('async'),
		stream_node = require('getstream-node'),
		bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
		auth = require('./auth.js'),
		AuthRouter = require('./AuthRouter'),
		formidable = require('formidable'),
		fs = require('fs');

var currentUser = AuthRouter.currentUser;

/*server crud controllers*/
discussions = require('../controllers/discussion.server.controller.js'),
	reviews = require('../controllers/review.server.controller.js'),
	users = require('../controllers/users.server.controller.js'),
	follows = require('../controllers/follow.server.controller.js'),
	watches = require('../controllers/watch.server.controller.js');

/*router and models*/
var StreamRouter = express.Router(),
	User = models.User,
	DiscussionPost = models.DiscussionPost,
	Review = models.Review,
	Follow = models.Follow,
	Watch = models.Watch;

/*stream api stuff*/
var FeedManager = stream_node.FeedManager;
var StreamMongoose = stream_node.mongoose;
var StreamBackend = new StreamMongoose.Backend();


var enrichActivities = function (body) {
	var activities = body.results;
	return StreamBackend.enrichActivities(activities);
};

/*passport stuff (NOT USED)*/
/*var ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/#!/login');
}; */


/*helper function that might be helpful*/
var did_i_follow = function (users, followers) {
	var followed_users_ids = _.map(followers, function (item) {
		return item.target.toHexString();
	});
	_.each(users, function (user) {
		if (followed_users_ids.indexOf(user._id.toHexString()) !== -1) {
			user.followed = true;
		}
	});
};

/*some more stream configuration*/
StreamRouter.use(function (req, res, next) {
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
StreamRouter.use(function (error, req, res, next) {
	if (!error) {
		next();
	} else {
		console.error(error.stack);
		res.send(500);
	}
});

/*populating 'req.user' property with useful fields..and something with notifications*/
StreamRouter.use(function (req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	} else if (!req.user.id) {
		User.findOne({
				username: req.user.username
			})

			.exec(function (err, user) {
				if (err) return next(err);

				notificationFeed = FeedManager.getNotificationFeed(user._id);

				req.user.id = user._id;
				req.user.token = notificationFeed.token;
				req.user.APP_ID = FeedManager.settings.apiAppId;
				req.user.APP_KEY = FeedManager.settings.apiKey;

				notificationFeed.get({
					limit: 0
				}).then(function (body) {
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
StreamRouter.use(bodyParser.urlencoded({
	extended: true
}));


/*fetches feed data for user by ID */
//NOTE TO SELF: ONLY THE DATA OF USERS YOU **FOLLOW** SHOW UP IN A USER'S FLAT FEED
StreamRouter.get('/home/:userId', function (req, res, next) {

	var flatFeed = FeedManager.getNewsFeeds(req.profile._id)['flat'];
	//console.log(flatFeed);
	flatFeed
		.get({})
		.then(enrichActivities)
		.then(function (enrichedActivities) {
			res.json({
				activities: enrichedActivities, //feed data

			});
		})
		.catch(next);
});



/*get user profile data by userId*/
StreamRouter.get('/profile/:userId', function (req, res, next) {
	var userFeed = FeedManager.getUserFeed(req.profile._id);
	//console.log((userFeed));
	var enrichment, userData, Followers, Following;
	userFeed
		.get({})
		.then(enrichActivities)
		.then(function (enrichedActivities) {
			res.json({
				activities: enrichedActivities
			})
		}).catch(next);

});


/******************
 Follow
 ******************/

//get the users a user is following
StreamRouter.get('/follow/:userId', function (req, res, next) {
	Follow.find({
		user: req.params.userId
	}, function (err, targets) {
		if (err) next(err);
		res.json(targets);
	});
});

//get a user's followers
StreamRouter.get('/follow/followers/:userId', function (req, res, next) {
	Follow.find({
		target: req.params.userId
	}, function (err, followers) {
		if (err) next(err);
		res.json(followers);
	});
});



/*should trigger when logged in user follows another user*/
StreamRouter.post('/follow/:userId', function (req, res, next) {
	User.findOne({
		_id: req.body.target
	}, function (err, target) {
		if (target) {
			var followData = {
				user: req.profile._id,
				target: req.body.target
			};
			var follow = new Follow(followData);
			follow.save(function (err) {
				if (err) next(err);
				res.set('Content-Type', 'application/json');
				return res.send({
					follow: {
						id: req.body.target
					}
				});
			});
		} else {
			res.status(404).send('Not found');
		}
	});
});

/*should trigger when logged in user unfollows another user*/
StreamRouter.delete('/follow/:userId', function (req, res) {
	Follow.findOne({
		user: req.profile._id,
		target: req.body.target
	}, function (
		err,
		follow
	) {
		if (follow) {
			follow.remove(function (err) {
				if (err) next(err);
				res.set('Content-Type', 'application/json');
				return res.send({
					follow: {
						id: req.body.target
					}
				});
			});
		} else {
			res.status(404).send('Not found');
		}
	});
});


//Local APIs with standard CRUD operations (similar to bootcamp assignment)

//Discussion API
StreamRouter.route('/discussions').get(discussions.list).post(discussions.create);

StreamRouter.route('/discussions/:discussionId')
	.get(discussions.read)
	.put(discussions.update)
	.delete(discussions.delete);

StreamRouter.param('discussionId', discussions.DiscussionByID);

//Review API
StreamRouter.route('/reviews').get(reviews.list).post(reviews.create);

StreamRouter.route('/reviews/:reviewId')
	.get(reviews.read)
	.put(reviews.update)
	.delete(reviews.delete);

StreamRouter.param('reviewId', reviews.ReviewByID);


//User API
StreamRouter.route('/users').get(users.list).post(users.create);

StreamRouter.route('/users/:userId')
	.get(users.read)
	.put(users.update)
	.delete(users.delete);

StreamRouter.route('/users/usernames/:user').get(users.read);

//Watch API
StreamRouter.route('/watch/:user').get(watches.getAllWatched);
StreamRouter.route('/watch').post(watches.create);

//Avatar upload
StreamRouter.route('/files/:userId').post(function (req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		var oldpath = files.avatar.path;
		var newpath = 'static/images/' + req.profile._id + '-' +
			files.avatar.name;

		fs.rename(oldpath, newpath, function (err) {
			if (err) throw err;
		});
		User.findById(req.profile._id, function (err, user) {
			if (err) throw err;
			user.avatar = newpath.substring(14);
			user.save(function (err) {
				if (err) throw err;
				console.log('User avatar updated.');
			})
		})


	});

	res.redirect('back');
})



StreamRouter.param('userId', users.UserByID); //creates req.profile property with user object
StreamRouter.param('user', users.UserByUserName); //creates req.profile property with user object


module.exports = StreamRouter;