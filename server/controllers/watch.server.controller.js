/* Dependencies */
var mongoose = require('mongoose'), 
    models= require('../models.js'),
    Watch=models.Watch;


/* Create a Watch Activity */
exports.create = function(req, res) {

  /* Instantiate a watch */
  var watch = new Watch(req.body);


  /* Then save the watch */
  watch.save(function(err) {
    if(err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(watch);
    }
  });
};


/*Get all movies a User has watched*/

exports.getAllWatched = function(req,res){

var user = req.profile;

Watch.find({user:user.id},function(err,watches){
if(err){
  console.log(err);
  res.status(400).send(err);
}
else{
  res.json(watches);
}

}

)};



