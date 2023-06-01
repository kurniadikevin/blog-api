var express = require('express');
var router = express.Router();
const Post = require("../models/post");
const async = require("async");

//file system and multer for manage image
const multer = require('multer');
var fs = require('fs');
var path = require('path');


//read posts
router.get('/', (req, res,next) => {
  Post.find({ published : true}, "")
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

// read posts and unpublish one too
router.get('/all', (req, res,next) => {
  Post.find({ }, "")
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
   author : req.body.author,
   published : req.body.published
   
 })
 posts.save(err => {
   if (err) { 
     return next(err);
   }
   res.status(200);
   res.redirect("http://localhost:3000");
 });
})


/* <-----------multer for image management-----------------> */
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'image-uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
// limit file size too 500kb
const limits= {fileSize : 0.5 * 1024 * 1024}
  
var upload = multer({ storage: storage, limits: limits ,fileFilter: function(_req, file, cb){
  checkFileType(file, cb);
  }});

  function checkFileType(file, cb){
    // Allowed ext file images
    const filetypes = /jpeg|jpg|png|gif|ico/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null, true);
    } else {
      return cb(null, false);
    }
  }

  /* <------------------- end of multer image management-------------> */


//create new post with multipart/form-data content-type
router.post('/new-multipart', upload.single('image'), (req, res, next) => {
  
  // untested on postman with body multipart/form-data issue
  const obj = new Post({
    title : req.body.title,
    body : req.body.body,
    author : req.body.author,
    published : req.body.published,
    imageContent :  req.file? [req.file.filename] : null, // req.file.filename for 1 image
  })
        obj.save((err)=>{
         if(err){
           return next(err);
        } else{
            //item.save();
            console.log('post with image sucessful');
            res.send(obj);
          }
        })      
      }
);

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
router.put('/:postId', (req, res,next) => {
    const posts = new Post({
      title : req.body.title,
      body : req.body.body,
      author : req.body.author,
      _id : req.params.postId,
      published : req.body.published,
      imageContent : req.body.imageContent, 
    })
  // Data from form is valid. Update the product.
  Post.findByIdAndUpdate(req.params.postId, posts, {}, (err, post) => {
    if (err) {
      return next(err);
    }
    // Successful: redirect to new product record.
    console.log('updated')
    res.send(`Post with id ${req.params.postId} updated`)
  });
});


//update post with image
router.put('/with-image/:postId',upload.single('image'), (req, res,next) => {
  const posts = new Post({
    title : req.body.title,
    body : req.body.body,
    author : req.body.author,
    _id : req.params.postId,
    published : req.body.published,
    imageContent :  req.file? [req.file.filename] : null, // req.file.filename for 1 image
  })
// Data from form is valid. Update the product.
Post.findByIdAndUpdate(req.params.postId, posts, {}, (err, post) => {
  if (err) {
    return next(err);
  }
  // Successful: redirect to new product record.
  console.log('updated')
  res.send(`Post with id ${req.params.postId} updated`)
});
});




//delete post
router.delete('/:postId/',(req,res,next)=>{
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
          res.send(`Post with id ${req.params.postId} succesfully deleted` )
          res.status(200).end();
        })
    }
  )
})


module.exports = router;
