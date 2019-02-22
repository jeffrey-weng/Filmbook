/* Dependencies */
var mongoose = require('mongoose'), 
    models= require('../models.js'),
    ReviewPost=models.ReviewPost;


/* Create a Review */
exports.create = function(req, res) {

  /* Instantiate a Review */
  var review = new ReviewPost(req.body);


  /* Then save the Review */
  review.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(review);
    }
  });
};

/* Show the current Review */
exports.read = function(req, res) {
  /* send back the Review as json from the request */
  res.json(req.review);
};

/* Update a Review */
exports.update = function(req, res) {
  var review = req.review; //this is the Review to be updated

  /* Replace the article's properties with the new properties found in req.body */
  /* Save the article */
  
  ReviewPost.findById(review._id,function(err,review){
	  if(err) throw err;
	  
	  review.description=req.body.description;
      review.rating=req.body.rating;
      review.upVotes=req.body.upvotes;
	  
	  review.save(function(err){
		  if(err)throw err;
		  
		  res.json(review);
		  console.log('Review saved successfully!');
		  
	  });
  });
};

/* Delete a Review */
exports.delete = function(req, res) {
  var review = req.review;

  /* Remove the article */
  
  ReviewPost.findOneAndRemove({author:review.author,movie:review.movie},function(err){
	  if(err){
		  throw err;
	  }	  
	  console.log('Review deleted!');
	  
  });
  
  res.send("Review deleted!");
  
};

/* Get all Reviews */
exports.list = function(req, res) {
  
  ReviewPost.find({}, function(err, reviews) {
  if (err) throw err;

 
  res.json(reviews);
});
  
};

/* 
  Middleware: find a Review by its ID, then pass it to the next request handler. 
  Find the Review using a mongoose query, 
        bind it to the request object as the property 'Review', 
        then finally call next
 */
exports.ReviewByID = function(req, res, next, id) {
  ReviewPost.findById(id).exec(function(err, review) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.review = review;
      next();
    }
  });
};