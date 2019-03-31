/* Dependencies */
var mongoose = require('mongoose'), 
    models = require('../models.js'),
    DiscussionPost=models.DiscussionPost;

/* Create a Discussion */
exports.create = function(req, res) {

  /* Instantiate a Discussion */
  var discussion = new DiscussionPost(req.body);


  /* Then save the Discussion */
  discussion.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(discussion);
    }
  });
};

/* Show the current Discussion */
exports.read = function(req, res) {
  /* send back the Discussion as json from the request */
  res.json(req.discussion);
};

/* Update a Discussion */
exports.update = function(req, res) {
  var discussion = req.discussion; //this is the Discussion to be updated

  /* Replace the article's properties with the new properties found in req.body */
  /* Save the article */
  
  DiscussionPost.findById(discussion._id,function(err,discussion){
	  if(err) throw err;
    
    if(req.body.title)
      discussion.title=req.body.title;

    if(req.body.description)
      discussion.description=req.body.description;
    
    if(req.body.upVotes)
      discussion.upVotes=req.body.upVotes;
    

	  
	  discussion.save(function(err){
		  if(err)throw err;
		  
		  res.json(discussion);
		  console.log('Discussion saved successfully!');
		  
	  });
  });
};

/* Delete a Discussion */
exports.delete = function(req, res) {
  var discussion = req.discussion;

  /* Remove the article */
  
  DiscussionPost.findOneAndRemove({title:discussion.title},function(err){
	  if(err){
		  throw err;
	  }	  
	  console.log('Discussion deleted!');
	  
  });
  
  res.send("Discussion deleted!");
  
};

/* Get all discussions */
exports.list = function(req, res) {
  
  DiscussionPost.find({}, function(err, discussions) {
  if (err) throw err;

 
  res.json(discussions);
});
  
};

/* 
  Middleware: find a Discussion by its ID, then pass it to the next request handler. 
  Find the Discussion using a mongoose query, 
        bind it to the request object as the property 'discussion', 
        then finally call next
 */
exports.DiscussionByID = function(req, res, next, id) {
  DiscussionPost.findById(id).exec(function(err, discussion) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.discussion = discussion;
      next();
    }
  });
};