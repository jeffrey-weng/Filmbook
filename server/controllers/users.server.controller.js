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
  res.json(req.profile);
};

/* Update a User */
exports.update = function(req, res) {
  var user = req.profile; //this is the User to be updated

  /* Replace the article's properties with the new properties found in req.body */
  /* Save the article */
  
  User.findById(user._id,function(err,user){
	  if(err) throw err;
  
    if(req.body.password)
      user.setPassword(req.body.password);

    if(req.body.email)
      user.email=req.body.email;

    if(req.body.favoriteMovies)
      user.favoriteMovies=req.body.favoriteMovies;

    if(req.body.favoriteGenres)  
      user.favoriteGenres=req.body.favoriteGenres;

    if(req.body.watchlist) {
      user.watchlist=req.body.watchlist;
      user.markModified('watchlist');
    }

    if(req.body.watched)  
      user.watched=req.body.watched;

    if(req.body.avatar)    
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
  var user = req.profile;

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

/*Getting a single user by username */
exports.UserByUserName = function(req,res,next,username) {

  User.findOne({username:username}).lean().exec(function(err, user) {
  if (err) return next(err);

     req.profile = user;
     next();
})}; 


/* 
  Middleware: find a User by its ID, then pass it to the next request handler. 
  Find the User using a mongoose query, 
        bind it to the request object as the property 'profile', 
        then finally call next
 */

 //named it req.profile because if it was req.user it might conflict with Passport's req.user?
exports.UserByID = function(req, res, next, id) {
  User.findById(id,function(err, user) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.profile = user;
      next();
    }
  });
};