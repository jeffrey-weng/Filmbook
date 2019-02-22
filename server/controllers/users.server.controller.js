/* Dependencies */
var mongoose = require('mongoose'), 
    models = require('../models.js'),
    User=models.User;


/* Create a User */
exports.create = function(req, res) {

  /* Instantiate a User */
  var user = new User(req.body);


  /* Then save the User */
  user.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(user);
    }
  });
};

/* Show the current User */
exports.read = function(req, res) {
  /* send back the User as json from the request */
  res.json(req.user);
};

/* Update a User */
exports.update = function(req, res) {
  var user = req.user; //this is the User to be updated

  /* Replace the article's properties with the new properties found in req.body */
  /* Save the article */
  
  User.findById(user._id,function(err,user){
	  if(err) throw err;
	  
      user.followed=req.body.followed;
      user.following=req.body.following;
      user.favoriteMovies=req.body.favoriteMovies;
      user.favoriteGenres=req.body.favoriteGenres;
      user.watchlist=req.body.watchlist;
      user.watched.push(req.body.watched);
      user.avatar=req.body.avatar;
	  
	  user.save(function(err){
		  if(err)throw err;
		  
		  res.json(user);
		  console.log('User saved successfully!');
		  
	  });
  });
};

/* Delete a User */
exports.delete = function(req, res) {
  var user = req.user;

  /* Remove the article */
  
  User.findOneAndRemove({username:user.username},function(err){
	  if(err){
		  throw err;
	  }	  
	  console.log('User deleted!');
	  
  });
  
  res.send("User deleted!");
  
};

/* Get all Users */
exports.list = function(req, res) {
  
  User.find({}, function(err, users) {
  if (err) throw err;

 
  res.json(users);
});
  
};

/* 
  Middleware: find a User by its ID, then pass it to the next request handler. 
  Find the User using a mongoose query, 
        bind it to the request object as the property 'User', 
        then finally call next
 */
exports.UserByID = function(req, res, next, id) {
  User.findById(id).exec(function(err, user) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.user = user;
      next();
    }
  });
};