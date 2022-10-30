var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt =require('bcryptjs');

//read all users
router.get('/', function(req, res, next) {
  res.send('render all users')
 });
 
 
 //create users get
 router.get('/sign-up', (req, res,next) => {
   //res.send('new users')
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
    admin : true
  }).save(err => {
    if (err) { 
      return next(err);
    }
    res.redirect("/");
    });
  })
});



 //read users detail get
 router.get('/:userId', function(req, res, next) {
   return res.send('read users'+ req.params.postId);
 });
 
 
 //update users
 router.put('/:userId', (req, res) => {
 
   return res.send('update users'+ req.params.postId);
 });
 
 //delete users
 router.delete('/:userId',(req,res)=>{
 
   return res.send('update users'+ req.params.postId);
 })
 

module.exports = router;
