/* Dependencies */
var mongoose = require('mongoose'), 
    models= require('../models.js'),
    Follow=models.Follow;


/* Create a Follow */
exports.create = function(req, res) {

  /* Instantiate a Follow */
  var follow = new Follow(req.body);


  /* Then save the Follow */
  follow.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(follow);
    }
  });
};

/*Get All Followers of A User*/

exports.getAllFollowersForUser = function(req,res){

var user = req.user;

Follow.find({target:user.id},function(err,followers){
if(err){
  console.log(err);
  res.status(400).send(err);
}
else{
  res.json(followers);
}

}

)};

/*Get all Users that a User is following*/
exports.getAllFollowingForUser = function(req,res){

  var user = req.user;
  
  Follow.find({user:user.id},function(err,following){
  if(err){
    console.log(err);
    res.status(400).send(err);
  }
  else{
    res.json(following);
  }
  
  }
  
  )};

/* Delete a Follow */
exports.delete = function(req, res) {
  var follow = req.follow;

  /* Remove the article */
  
  Follow.findOneAndRemove({user:follow.user},function(err){
	  if(err){
		  throw err;
	  }	  
	  console.log('Unfollowed!');
	  
  });
  
  res.send("Unfollowed!");
  
};

