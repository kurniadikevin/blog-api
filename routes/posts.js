var express = require('express');
var router = express.Router();
//import { v4 as uuidv4 } from 'uuid';
const Post = require("../models/post");
const async = require("async");



//read posts
router.get('/', (req, res,next) => {
  Post.find({}, "")
  .sort({ date: -1 })
  .populate("comment")
  .exec(function (err, list_posts) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.send(list_posts);
  });
});


//create new post get
router.get('/new', (req, res,next) => {
  //res.send('new post')
  res.render('post-form',{title: 'Create new post sample'})
});

//create new post post
router.post('/new', (req,res,next)=>{

  const posts = new Post({
    title : req.body.title,
   body : req.body.text,
   author : req.body.author
   
 })
 posts.save(err => {
   if (err) { 
     return next(err);
   }
   res.redirect("http://localhost:3000/");
 });
})

//read post detail get
router.get('/:postId', function(req, res, next) {
  Post.find({_id: req.params.postId}, "")
  .populate("comment")
  
  .exec(function (err, list_posts) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.send(list_posts);
  });
});



//update post
router.put('/:postId', (req, res) => {

  return res.send('update post'+ req.params.postId);
});

//delete post
router.delete('/:postId/',(req,res)=>{

  async.parallel(
    {
      post(callback){
        Post.findById(req.params.postId).exec(callback);

      }
    },
    (err,results) => {
      if(err) {
        return next(err);
      }
      //success
      Post.findByIdAndRemove(req.params.postId,
        (err)=> {
          //if error happen when removing
          if(err){
            return next(err);
          }
          // Sucessfully remove then redirect
          console.log('succesfully deleted')
          res.status(200).end();
        })

    }
  )
})


module.exports = router;
