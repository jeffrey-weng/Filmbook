var config = require('./config/config'),
	express = require('express'),
	models = require('./models'),
	passport = require('passport'),
	_ = require('underscore'),
	async = require('async'),
	stream_node = require('getstream-node'),
	fs = require('fs'),
	bodyParser = require('body-parser'),


var router = express.Router(),
	User = models.User,
    DiscussionPost = models.DiscussionPost,
    ReviewPost=models.ReviewPost,
    Follow = models.Follow;

var FeedManager = stream_node.FeedManager;
var StreamMongoose = stream_node.mongoose;
var StreamBackend = new StreamMongoose.Backend();

var enrichActivities = function(body) {
	var activities = body.results;
	return StreamBackend.enrichActivities(activities);
};

var ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};



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

router.use(function(error, req, res, next) {
	if (!error) {
		next();
	} else {
		console.error(error.stack);
		res.send(500);
	}
});

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


router.use(bodyParser.urlencoded({ extended: true }));

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

		
	//Getting a single user's reviews and discussions by username
	var getUserByUserName = function(username) {User.findOne({username:username}).populate('discussions').populate('reviews').lean().exec(function(err, user) {
		if (err) return next(err);

			return {
				user: user
			};
		
		
	})}; 

	var getUserFollowing = function(id){

		Follow.find({user: id}).exec(function(err,follows){
			if(err) return next(err);
			return{
				following:follows //access following by .target
			}
		})


	}

	var getUserFollowers = function(id){
		Follow.find({target: id}).exec(function(err,follows){
			if(err) return next(err);
			return{
				followers:follows //access followers by .user
			}
		})

	}

/******************
  User Profile
******************/

router.get('/profile', ensureAuthenticated, function(req, res, next) {
	var userFeed = FeedManager.getUserFeed(req.user.id);

	userFeed
		.get({})
		.then(enrichActivities)
		.then(function(enrichedActivities) {
			res.json({
				location: 'profile',
				activities: enrichedActivities,
				userData: getUserByUserName(req.user.username),
				Following: getUserFollowing(req.user.id),
				followedBy: getUserFollowers(req.user.id),
				path: req.url,
				show_feed: true,
			});
		})
		.catch(next);
});

router.get('/profile/:user', ensureAuthenticated, function(req, res, next) {
	User.findOne({ username: req.params.user }, function(err, foundUser) {
		if (err) return next(err);

		if (!foundUser)
			return res.send('User ' + req.params.user + ' not found.');

		var flatFeed = FeedManager.getNewsFeeds(foundUser._id)['flat'];

		flatFeed
			.get({})
			.then(enrichActivities)
			.then(function(enrichedActivities) {
				res.json({
					location: 'profile',
					activities: enrichedActivities,
					userData: getUserByUserName(req.user.username),
					Following: getUserFollowing(req.user.id),
					followedBy: getUserFollowers(req.user.id),
					path: req.url,
					show_feed: true,
				});
			})
			.catch(next);
	});
});

/******************
  Follow
******************/

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

module.exports = router;