var express = require('express');
var router = express.Router();
//import { v4 as uuidv4 } from 'uuid';
const Comment = require("../models/comment");
const Post = require("../models/post");


//read comment all
router.get('/:postId/comment', function(req, res, next) {
  Comment.find({postId: req.params.postId}, "")
  .sort({ date: 1 })
  //.populate("comment")
  .exec(function (err, result) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.send(result);
  });
});

//create form sample comment GET
router.get('/:postId/comment/form', function(req, res, next) {
  res.render('comment-form',{title: 'Comment form for sample'})
 });

 //create form sample comment POST
router.post('/:postId/comment/form', function(req, res, next) {
  const comments = new Comment({
    postId : req.params.postId,
   text_comment : req.body.text, 
   author : req.body.user
 })
 comments.save(err => {
   if (err) { 
     return next(err);
   }
   res.redirect(`http://localhost:3001/posts/${req.params.postId}`);
 });
})


//create comment get
router.get('/newComment', (req, res,next) => {
  res.send('create new comment')
});

//read comment detail get
router.get('/:commentId', function(req, res, next) {
  return res.send('read comment'+ req.params.postId);
});

//update comment
router.put('/:commentId', (req, res) => {

  return res.send('update comment'+ req.params.postId);
});

//delete comment
router.delete('/:commentId',(req,res)=>{

  return res.send('update comment'+ req.params.postId);
})


module.exports = router;
