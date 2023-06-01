var express = require('express');
var router = express.Router();
//import { v4 as uuidv4 } from 'uuid';
const Comment = require("../models/comment");
const async = require("async");


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

// get comment by comment id
router.get('/comment/:commentId', function(req, res, next) {
  Comment.find({_id: req.params.commentId}, "")
  .exec(function (err, list_posts) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.send(list_posts);
  });
});


//create form sample comment GET
router.get('/:postId/comment/form', function(req, res, next) {
  res.render('comment-form',{title: 'Comment form for sample'})
 });

 //create comment on specific post
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
   res.redirect(`https://blackboardjournal.vercel.app/posts/${req.params.postId}`);
 });
})


//update comment
router.put('/comment/update/:commentId', (req, res,next) => {

  const comment = new Comment({
   text_comment : req.body.text, 
   author : req.body.user,
  _id : req.params.commentId
  })
  // Data from form is valid. Update the product.
  Comment.findByIdAndUpdate(req.params.commentId, comment, {}, (err, post) => {
    if (err) {
      return next(err);
    }
    res.send(`Comment with id ${req.params.commentId} updated`)
  });
});

router.delete('/comment/:commentId/',(req,res,next)=>{
  async.parallel(
    {
      comment(callback){
        Comment.findById(req.params.commentId).exec(callback);
      }
    }, (err,results) => {
      if(err) {
        return next(err);
      }
      //success
      Comment.findByIdAndRemove(req.params.commentId,
        (err)=> {
          //if error happen when removing
          if(err){
            return next(err);
          }
          // Sucessfully remove then redirect
          res.send(`Comment with id ${req.params.commentId} succesfully deleted` )
          res.status(200).end();
        })
    }
  )
})

module.exports = router;
