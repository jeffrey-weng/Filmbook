/* Dependencies */
var mongoose = require('mongoose'), 
    models = require('../models.js'),
    Comment=models.Comment;

/* Create a Comment */
exports.create = function(req, res) {

  /* Instantiate a comment */
  var comment = new Comment(req.body);


  /* Then save the comment */
  comment.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(comment);
    }
  });
};

/* Show the current comment */
exports.read = function(req, res) {
  /* send back the comment as json from the request */
  res.json(req.comment);
};

/* Update a comment */
exports.update = function(req, res) {
  var comment = req.comment; //this is the comment to be updated

  /* Replace the article's properties with the new properties found in req.body */
  /* Save the article */
  
  Comment.findById(comment._id,function(err,comment){
	  if(err) throw err;
	  
	  if(req.body.description)
      comment.description=req.body.description;
     
	  
	  comment.save(function(err){
		  if(err)throw err;
		  
		  res.json(comment);
		  console.log('comment saved successfully!');
		  
	  });
  });
};

/* Delete a comment */
exports.delete = function(req, res) {
  var comment = req.comment;

  /* Remove the article */
  
  Comment.findOneAndRemove({_id:comment._id},function(err){
	  if(err){
		  throw err;
	  }	  
	  console.log('comment deleted!');
	  
  });
  
  res.send("comment deleted!");
  
};

/* Get all comments */
exports.list = function(req, res) {
  
  Comment.find({}, function(err, comments) {
  if (err) throw err;

 
  res.json(comments);
});
  
};

exports.listByDiscussion = function(req, res) {
  
  Comment.find({discussion:req.params.discussionId}, function(err, comments) {
  if (err) throw err;

 
  res.json(comments);
});
  
};

/* 
  Middleware: find a comment by its ID, then pass it to the next request handler. 
  Find the comment using a mongoose query, 
        bind it to the request object as the property 'comment', 
        then finally call next
 */
exports.commentByID = function(req, res, next, id) {
  Comment.findById(id).exec(function(err, comment) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.comment = comment;
      next();
    }
  });
};