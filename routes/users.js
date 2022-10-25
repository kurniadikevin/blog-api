var express = require('express');
var router = express.Router();


//read all users
router.get('/users', function(req, res, next) {
  res.send('render all users')
 });
 
 //create users get
 router.get('/newUser', (req, res,next) => {
   //res.send('new users')
   res.send('create new users')
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
