var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt =require('bcryptjs');
const async = require("async");


 // get all user
 router.get('/all', (req, res,next) => {
  User.find({ }, {password: 0})
  .sort({ date: -1 })
  .exec(function (err, list_posts) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.send(list_posts);
  });
});
 
 
 //create users get
 router.get('/sign-up', (req, res,next) => {
   res.render('sign-up',{title: 'Sign up'})
 });
 
//create user post
router.post("/sign-up", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    // if err, do something
    if(err){
      return next('password failed to proceed');
    }
  const user = new User({
    fullname : req.body.fullname,
    username: req.body.username,
    password: hashedPassword,
    admin : req.body.admin
  }).save(err => {
    if (err) { 
      return next(err);
    }
    res.status(200)
    res.redirect("/");
    });
  })
});



 //read users detail get
 router.get('/:userId', function(req, res, next) {
  User.find({ _id: req.params.userId }, {password: 0})
  .sort({ date: -1 })
  .exec(function (err, list_posts) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.send(list_posts);
  })
 });
 
 
//update user
router.put('/:userId', (req, res,next) => {

  const user = new User({
    fullname : req.body.fullname,
    username: req.body.username,
    admin : req.body.admin,
    _id : req.params.userId,
})

// Data from form is valid. Update the product.
User.findByIdAndUpdate(req.params.userId, user, {}, (err, post) => {
  if (err) {
    return next(err);
  }
  // Successful: redirect to new product record.
  console.log('user updated')
  res.send(`User with id ${req.params.userId} updated`)
});
});
 
//delete user
router.delete('/:userId/',(req,res,next)=>{

  async.parallel(
    {
      user(callback){
        User.findById(req.params.userId).exec(callback);
      }
    },
    (err,results) => {
      if(err) {
        return next(err);
      }
      //success
      User.findByIdAndRemove(req.params.userId,
        (err)=> {
          //if error happen when removing
          if(err){
            return next(err);
          }
          // Sucessfully remove then redirect
          res.send(`User with id ${req.params.userId} succesfully deleted` )
          res.status(200).end();
        })
    }
  )
})
 

module.exports = router;
